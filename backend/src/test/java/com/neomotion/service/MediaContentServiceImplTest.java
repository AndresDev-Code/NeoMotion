package com.neomotion.service;

import com.neomotion.dto.MediaContentRequestDTO;
import com.neomotion.dto.MediaContentResponseDTO;
import com.neomotion.entity.MediaContent;
import com.neomotion.entity.MediaContentType;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.MediaContentRepository;
import com.neomotion.repository.ScheduleRepository;
import com.neomotion.service.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;

import java.nio.charset.StandardCharsets;

import java.util.List;
import java.util.Optional;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MediaContentServiceImplTest {

    @Mock
    private MediaContentRepository mediaContentRepository;

    @Mock
    private StorageService storageService;

    @Mock
    private ScheduleRepository scheduleRepository;

    private MediaContentServiceImpl mediaContentService;

    @BeforeEach
    void setUp() {

        mediaContentService =
                new MediaContentServiceImpl(
                        mediaContentRepository,
                        storageService,
                        scheduleRepository
                );
    }

    @Test
    void saveShouldCreateMediaContent() {

        // ARRANGE
        MediaContentRequestDTO request =
                new MediaContentRequestDTO();

        request.setTitle("Promo NeoMotion");
        request.setDescription("Promo de prueba");
        request.setType(MediaContentType.PROMO);
        request.setDurationSeconds(30);
        request.setThumbnail("/uploads/images/promo.png");
        request.setVideoUrl("/uploads/videos/promo.mp4");

        when(mediaContentRepository.save(any(MediaContent.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        MediaContentResponseDTO response =
                mediaContentService.save(request);

        // ASSERT
        ArgumentCaptor<MediaContent> captor =
                ArgumentCaptor.forClass(MediaContent.class);

        verify(mediaContentRepository)
                .save(captor.capture());

        MediaContent savedContent =
                captor.getValue();

        assertEquals(
                "Promo NeoMotion",
                savedContent.getTitle()
        );

        assertEquals(
                "Promo de prueba",
                savedContent.getDescription()
        );

        assertEquals(
                MediaContentType.PROMO,
                savedContent.getType()
        );

        assertEquals(
                30,
                savedContent.getDurationSeconds()
        );

        assertEquals(
                "/uploads/images/promo.png",
                savedContent.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/promo.mp4",
                savedContent.getVideoUrl()
        );

        assertTrue(savedContent.getActive());

        assertNotNull(response);

        assertEquals(
                "Promo NeoMotion",
                response.getTitle()
        );

        assertEquals(
                MediaContentType.PROMO,
                response.getType()
        );

        assertEquals(
                30,
                response.getDurationSeconds()
        );

        assertEquals(
                "/uploads/images/promo.png",
                response.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/promo.mp4",
                response.getVideoUrl()
        );

        assertTrue(response.getActive());
    }
    @Test
    void saveWithFilesShouldStoreFilesAndCreateMediaContent() {

        // ARRANGE
        MediaContentRequestDTO request =
                new MediaContentRequestDTO();

        request.setTitle("Promo con archivos");
        request.setDescription("Contenido de prueba");
        request.setType(MediaContentType.PROMO);
        request.setDurationSeconds(30);

        MockMultipartFile thumbnail =
                new MockMultipartFile(
                        "thumbnail",
                        "promo.png",
                        "image/png",
                        "imagen de prueba".getBytes(StandardCharsets.UTF_8)
                );

        MockMultipartFile video =
                new MockMultipartFile(
                        "video",
                        "promo.mp4",
                        "video/mp4",
                        "video de prueba".getBytes(StandardCharsets.UTF_8)
                );

        when(storageService.saveImage(thumbnail))
                .thenReturn("generated-thumbnail.png");

        when(storageService.saveVideo(video))
                .thenReturn("generated-video.mp4");

        when(mediaContentRepository.save(any(MediaContent.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        MediaContentResponseDTO response =
                mediaContentService.saveWithFiles(
                        request,
                        thumbnail,
                        video
                );

        // ASSERT
        verify(storageService)
                .saveImage(thumbnail);

        verify(storageService)
                .saveVideo(video);

        ArgumentCaptor<MediaContent> captor =
                ArgumentCaptor.forClass(MediaContent.class);

        verify(mediaContentRepository)
                .save(captor.capture());

        MediaContent savedContent =
                captor.getValue();

        assertEquals(
                "Promo con archivos",
                savedContent.getTitle()
        );

        assertEquals(
                "Contenido de prueba",
                savedContent.getDescription()
        );

        assertEquals(
                MediaContentType.PROMO,
                savedContent.getType()
        );

        assertEquals(
                30,
                savedContent.getDurationSeconds()
        );

        assertEquals(
                "/uploads/images/generated-thumbnail.png",
                savedContent.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/generated-video.mp4",
                savedContent.getVideoUrl()
        );

        assertTrue(savedContent.getActive());

        assertNotNull(response);

        assertEquals(
                "/uploads/images/generated-thumbnail.png",
                response.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/generated-video.mp4",
                response.getVideoUrl()
        );
    }
    @Test
    void findByIdShouldReturnMediaContent() {

        // ARRANGE
        Long contentId = 1L;

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(contentId);
        mediaContent.setTitle("Promo NeoMotion");
        mediaContent.setDescription("Contenido de prueba");
        mediaContent.setType(MediaContentType.PROMO);
        mediaContent.setDurationSeconds(30);
        mediaContent.setThumbnail("/uploads/images/promo.png");
        mediaContent.setVideoUrl("/uploads/videos/promo.mp4");
        mediaContent.setActive(true);

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.of(mediaContent));

        // ACT
        MediaContentResponseDTO response =
                mediaContentService.findById(contentId);

        // ASSERT
        assertNotNull(response);

        assertEquals(contentId, response.getId());
        assertEquals("Promo NeoMotion", response.getTitle());
        assertEquals("Contenido de prueba", response.getDescription());
        assertEquals(MediaContentType.PROMO, response.getType());
        assertEquals(30, response.getDurationSeconds());
        assertEquals(
                "/uploads/images/promo.png",
                response.getThumbnail()
        );
        assertEquals(
                "/uploads/videos/promo.mp4",
                response.getVideoUrl()
        );
        assertTrue(response.getActive());

        verify(mediaContentRepository)
                .findById(contentId);
    }
    @Test
    void findByIdShouldRejectWhenMediaContentDoesNotExist() {

        // ARRANGE
        Long contentId = 999L;

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> mediaContentService.findById(contentId)
        );

        assertEquals(
                "Contenido multimedia no encontrado.",
                exception.getMessage()
        );

        verify(mediaContentRepository)
                .findById(contentId);
    }
    @Test
    void findByTypeShouldReturnMediaContentOfType() {

        // ARRANGE
        MediaContentType type = MediaContentType.PROMO;

        MediaContent firstContent = new MediaContent();
        firstContent.setId(1L);
        firstContent.setTitle("Promo 1");
        firstContent.setDescription("Primera promo");
        firstContent.setType(type);
        firstContent.setDurationSeconds(30);
        firstContent.setActive(true);

        MediaContent secondContent = new MediaContent();
        secondContent.setId(2L);
        secondContent.setTitle("Promo 2");
        secondContent.setDescription("Segunda promo");
        secondContent.setType(type);
        secondContent.setDurationSeconds(45);
        secondContent.setActive(true);

        when(mediaContentRepository.findByType(type))
                .thenReturn(List.of(firstContent, secondContent));

        // ACT
        List<MediaContentResponseDTO> response =
                mediaContentService.findByType(type);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals("Promo 1", response.get(0).getTitle());
        assertEquals(type, response.get(0).getType());
        assertEquals(30, response.get(0).getDurationSeconds());

        assertEquals(2L, response.get(1).getId());
        assertEquals("Promo 2", response.get(1).getTitle());
        assertEquals(type, response.get(1).getType());
        assertEquals(45, response.get(1).getDurationSeconds());

        verify(mediaContentRepository)
                .findByType(type);
    }
    @Test
    void findActiveShouldReturnActiveMediaContent() {

        // ARRANGE
        MediaContent firstContent = new MediaContent();
        firstContent.setId(1L);
        firstContent.setTitle("Promo activa");
        firstContent.setDescription("Contenido activo");
        firstContent.setType(MediaContentType.PROMO);
        firstContent.setDurationSeconds(30);
        firstContent.setActive(true);

        MediaContent secondContent = new MediaContent();
        secondContent.setId(2L);
        secondContent.setTitle("Bumper activo");
        secondContent.setDescription("Bumper activo");
        secondContent.setType(MediaContentType.BUMPER);
        secondContent.setDurationSeconds(10);
        secondContent.setActive(true);

        when(mediaContentRepository.findByActiveTrue())
                .thenReturn(List.of(firstContent, secondContent));

        // ACT
        List<MediaContentResponseDTO> response =
                mediaContentService.findActive();

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals("Promo activa", response.get(0).getTitle());
        assertEquals(MediaContentType.PROMO, response.get(0).getType());
        assertTrue(response.get(0).getActive());

        assertEquals(2L, response.get(1).getId());
        assertEquals("Bumper activo", response.get(1).getTitle());
        assertEquals(MediaContentType.BUMPER, response.get(1).getType());
        assertTrue(response.get(1).getActive());

        verify(mediaContentRepository)
                .findByActiveTrue();
    }
    @Test
    void findActiveByTypeShouldReturnActiveMediaContentOfType() {

        // ARRANGE
        MediaContentType type = MediaContentType.BUMPER;

        MediaContent firstContent = new MediaContent();
        firstContent.setId(1L);
        firstContent.setTitle("Bumper 1");
        firstContent.setDescription("Primer bumper");
        firstContent.setType(type);
        firstContent.setDurationSeconds(10);
        firstContent.setActive(true);

        MediaContent secondContent = new MediaContent();
        secondContent.setId(2L);
        secondContent.setTitle("Bumper 2");
        secondContent.setDescription("Segundo bumper");
        secondContent.setType(type);
        secondContent.setDurationSeconds(15);
        secondContent.setActive(true);

        when(mediaContentRepository.findByTypeAndActiveTrue(type))
                .thenReturn(List.of(firstContent, secondContent));

        // ACT
        List<MediaContentResponseDTO> response =
                mediaContentService.findActiveByType(type);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals("Bumper 1", response.get(0).getTitle());
        assertEquals(type, response.get(0).getType());
        assertTrue(response.get(0).getActive());

        assertEquals(2L, response.get(1).getId());
        assertEquals("Bumper 2", response.get(1).getTitle());
        assertEquals(type, response.get(1).getType());
        assertTrue(response.get(1).getActive());

        verify(mediaContentRepository)
                .findByTypeAndActiveTrue(type);
    }
    @Test
    void updateShouldModifyMediaContent() {

        // ARRANGE
        Long contentId = 1L;

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(contentId);
        mediaContent.setTitle("Título anterior");
        mediaContent.setDescription("Descripción anterior");
        mediaContent.setType(MediaContentType.PROMO);
        mediaContent.setDurationSeconds(30);
        mediaContent.setThumbnail("/uploads/images/old.png");
        mediaContent.setVideoUrl("/uploads/videos/old.mp4");
        mediaContent.setActive(true);

        MediaContentRequestDTO request =
                new MediaContentRequestDTO();

        request.setTitle("Título actualizado");
        request.setDescription("Descripción actualizada");
        request.setType(MediaContentType.BUMPER);
        request.setDurationSeconds(15);
        request.setThumbnail("/uploads/images/new.png");
        request.setVideoUrl("/uploads/videos/new.mp4");

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.of(mediaContent));

        when(mediaContentRepository.save(any(MediaContent.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        MediaContentResponseDTO response =
                mediaContentService.update(contentId, request);

        // ASSERT
        assertEquals(
                "Título actualizado",
                mediaContent.getTitle()
        );

        assertEquals(
                "Descripción actualizada",
                mediaContent.getDescription()
        );

        assertEquals(
                MediaContentType.BUMPER,
                mediaContent.getType()
        );

        assertEquals(
                15,
                mediaContent.getDurationSeconds()
        );

        assertEquals(
                "/uploads/images/new.png",
                mediaContent.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/new.mp4",
                mediaContent.getVideoUrl()
        );

        assertEquals(
                "Título actualizado",
                response.getTitle()
        );

        assertEquals(
                MediaContentType.BUMPER,
                response.getType()
        );

        assertEquals(
                15,
                response.getDurationSeconds()
        );

        verify(mediaContentRepository)
                .save(mediaContent);

        verifyNoInteractions(storageService);
    }
    @Test
    void updateWithFilesShouldReplaceOldFiles() {

        // ARRANGE
        Long contentId = 1L;

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(contentId);
        mediaContent.setTitle("Promo anterior");
        mediaContent.setDescription("Descripción anterior");
        mediaContent.setType(MediaContentType.PROMO);
        mediaContent.setDurationSeconds(30);
        mediaContent.setThumbnail("/uploads/images/old-poster.png");
        mediaContent.setVideoUrl("/uploads/videos/old-video.mp4");
        mediaContent.setActive(true);

        MediaContentRequestDTO request =
                new MediaContentRequestDTO();

        request.setTitle("Promo actualizada");
        request.setDescription("Descripción actualizada");
        request.setType(MediaContentType.BUMPER);
        request.setDurationSeconds(15);

        MockMultipartFile thumbnail =
                new MockMultipartFile(
                        "thumbnail",
                        "new-poster.png",
                        "image/png",
                        "nueva imagen".getBytes(StandardCharsets.UTF_8)
                );

        MockMultipartFile video =
                new MockMultipartFile(
                        "video",
                        "new-video.mp4",
                        "video/mp4",
                        "nuevo video".getBytes(StandardCharsets.UTF_8)
                );

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.of(mediaContent));

        when(storageService.saveImage(thumbnail))
                .thenReturn("generated-poster.png");

        when(storageService.saveVideo(video))
                .thenReturn("generated-video.mp4");

        when(mediaContentRepository.save(any(MediaContent.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        MediaContentResponseDTO response =
                mediaContentService.updateWithFiles(
                        contentId,
                        request,
                        thumbnail,
                        video
                );

        // ASSERT

        verify(storageService)
                .deleteImage("old-poster.png");

        verify(storageService)
                .deleteVideo("old-video.mp4");

        verify(storageService)
                .saveImage(thumbnail);

        verify(storageService)
                .saveVideo(video);

        verify(mediaContentRepository)
                .save(mediaContent);

        assertEquals(
                "Promo actualizada",
                mediaContent.getTitle()
        );

        assertEquals(
                "Descripción actualizada",
                mediaContent.getDescription()
        );

        assertEquals(
                MediaContentType.BUMPER,
                mediaContent.getType()
        );

        assertEquals(
                15,
                mediaContent.getDurationSeconds()
        );

        assertEquals(
                "/uploads/images/generated-poster.png",
                mediaContent.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/generated-video.mp4",
                mediaContent.getVideoUrl()
        );

        assertEquals(
                "Promo actualizada",
                response.getTitle()
        );

        assertEquals(
                MediaContentType.BUMPER,
                response.getType()
        );

        assertEquals(
                "/uploads/images/generated-poster.png",
                response.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/generated-video.mp4",
                response.getVideoUrl()
        );
    }
    @Test
    void updateWithFilesShouldKeepOldFilesWhenNoNewFilesAreProvided() {

        // ARRANGE
        Long contentId = 1L;

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(contentId);
        mediaContent.setTitle("Promo anterior");
        mediaContent.setDescription("Descripción anterior");
        mediaContent.setType(MediaContentType.PROMO);
        mediaContent.setDurationSeconds(30);
        mediaContent.setThumbnail("/uploads/images/old-poster.png");
        mediaContent.setVideoUrl("/uploads/videos/old-video.mp4");
        mediaContent.setActive(true);

        MediaContentRequestDTO request =
                new MediaContentRequestDTO();

        request.setTitle("Promo actualizada");
        request.setDescription("Nueva descripción");
        request.setType(MediaContentType.BUMPER);
        request.setDurationSeconds(15);

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.of(mediaContent));

        when(mediaContentRepository.save(any(MediaContent.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        MediaContentResponseDTO response =
                mediaContentService.updateWithFiles(
                        contentId,
                        request,
                        null,
                        null
                );

        // ASSERT
        verify(storageService, never())
                .deleteImage(anyString());

        verify(storageService, never())
                .deleteVideo(anyString());

        verify(storageService, never())
                .saveImage(any());

        verify(storageService, never())
                .saveVideo(any());

        verify(mediaContentRepository)
                .save(mediaContent);

        assertEquals(
                "/uploads/images/old-poster.png",
                mediaContent.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/old-video.mp4",
                mediaContent.getVideoUrl()
        );

        assertEquals(
                "Promo actualizada",
                response.getTitle()
        );

        assertEquals(
                MediaContentType.BUMPER,
                response.getType()
        );

        assertEquals(
                "/uploads/images/old-poster.png",
                response.getThumbnail()
        );

        assertEquals(
                "/uploads/videos/old-video.mp4",
                response.getVideoUrl()
        );
    }
    @Test
    void deleteByIdShouldRejectWhenMediaContentIsScheduled() {

        // ARRANGE
        Long contentId = 1L;

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(contentId);
        mediaContent.setTitle("Promo programada");
        mediaContent.setType(MediaContentType.PROMO);
        mediaContent.setDurationSeconds(30);
        mediaContent.setThumbnail("/uploads/images/promo.png");
        mediaContent.setVideoUrl("/uploads/videos/promo.mp4");

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.of(mediaContent));

        when(scheduleRepository.existsByMediaContentId(contentId))
                .thenReturn(true);

        // ACT + ASSERT
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> mediaContentService.deleteById(contentId)
        );

        assertEquals(
                "No se puede eliminar este contenido multimedia porque está siendo utilizado en una programación.",
                exception.getMessage()
        );

        verify(mediaContentRepository, never())
                .delete(any(MediaContent.class));

        verify(storageService, never())
                .deleteImage(anyString());

        verify(storageService, never())
                .deleteVideo(anyString());
    }
    @Test
    void deleteByIdShouldDeleteMediaContentAndAssociatedFiles() {

        // ARRANGE
        Long contentId = 1L;

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(contentId);
        mediaContent.setTitle("Promo a eliminar");
        mediaContent.setType(MediaContentType.PROMO);
        mediaContent.setDurationSeconds(30);
        mediaContent.setThumbnail("/uploads/images/promo.png");
        mediaContent.setVideoUrl("/uploads/videos/promo.mp4");
        mediaContent.setActive(true);

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.of(mediaContent));

        when(scheduleRepository.existsByMediaContentId(contentId))
                .thenReturn(false);

        // ACT
        mediaContentService.deleteById(contentId);

        // ASSERT
        verify(storageService)
                .deleteImage("promo.png");

        verify(storageService)
                .deleteVideo("promo.mp4");

        verify(mediaContentRepository)
                .delete(mediaContent);
    }
    @Test
    void deleteByIdShouldRejectWhenMediaContentDoesNotExist() {

        // ARRANGE
        Long contentId = 999L;

        when(mediaContentRepository.findById(contentId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> mediaContentService.deleteById(contentId)
        );

        assertEquals(
                "Contenido multimedia no encontrado.",
                exception.getMessage()
        );

        verify(scheduleRepository, never())
                .existsByMediaContentId(anyLong());

        verify(mediaContentRepository, never())
                .delete(any(MediaContent.class));

        verifyNoInteractions(storageService);
    }
}