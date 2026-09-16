package com.neomotion.service;

import com.neomotion.dto.EpisodeRequestDTO;
import com.neomotion.dto.EpisodeResponseDTO;
import com.neomotion.entity.Episode;
import com.neomotion.entity.Schedule;
import com.neomotion.entity.Season;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.EpisodeRepository;
import com.neomotion.repository.ScheduleRepository;
import com.neomotion.repository.SeasonRepository;
import com.neomotion.service.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.anyLong;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EpisodeServiceImplTest {

    @Mock
    private EpisodeRepository episodeRepository;

    @Mock
    private SeasonRepository seasonRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private StorageService storageService;

    private EpisodeServiceImpl episodeService;

    @BeforeEach
    void setUp() {

        episodeService =
                new EpisodeServiceImpl(
                        episodeRepository,
                        seasonRepository,
                        storageService,
                        scheduleRepository
                );
    }

    @Test
    void saveShouldCreateEpisode() {

        // ARRANGE
        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(1L);
        request.setEpisodeNumber(1);
        request.setTitle("Episodio de prueba");
        request.setDescription("Descripción de prueba");
        request.setDurationMinutes(24);
        request.setThumbnail("poster.png");
        request.setVideoUrl("episode.mp4");

        when(
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        1L,
                        1
                )
        ).thenReturn(Optional.empty());

        when(seasonRepository.findById(1L))
                .thenReturn(Optional.of(season));

        when(episodeRepository.save(any(Episode.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        EpisodeResponseDTO response =
                episodeService.save(request);

        // ASSERT
        ArgumentCaptor<Episode> captor =
                ArgumentCaptor.forClass(Episode.class);

        verify(episodeRepository)
                .save(captor.capture());

        Episode savedEpisode =
                captor.getValue();

        assertEquals(
                1,
                savedEpisode.getEpisodeNumber()
        );

        assertEquals(
                "Episodio de prueba",
                savedEpisode.getTitle()
        );

        assertEquals(
                "Descripción de prueba",
                savedEpisode.getDescription()
        );

        assertEquals(
                24,
                savedEpisode.getDurationMinutes()
        );

        assertEquals(
                "poster.png",
                savedEpisode.getThumbnail()
        );

        assertEquals(
                "episode.mp4",
                savedEpisode.getVideoUrl()
        );

        assertTrue(savedEpisode.getActive());

        assertEquals(
                season,
                savedEpisode.getSeason()
        );

        assertNotNull(response);

        assertEquals(
                "Episodio de prueba",
                response.getTitle()
        );

        assertEquals(
                1L,
                response.getSeasonId()
        );

        assertEquals(
                "Temporada 1",
                response.getSeasonTitle()
        );
    }

    @Test
    void saveShouldRejectDuplicateEpisodeNumber() {

        // ARRANGE
        Episode existingEpisode = new Episode();
        existingEpisode.setId(10L);

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(1L);
        request.setEpisodeNumber(1);
        request.setTitle("Episodio duplicado");
        request.setDescription("Descripción");
        request.setDurationMinutes(24);

        when(
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        1L,
                        1
                )
        ).thenReturn(Optional.of(existingEpisode));

        // ACT + ASSERT
        ResourceConflictException exception = assertThrows(
                ResourceConflictException.class,
                () -> episodeService.save(request)
        );

        assertEquals(
                "El episodio ya existe en esta temporada.",
                exception.getMessage()
        );

        verify(seasonRepository, never())
                .findById(anyLong());

        verify(episodeRepository, never())
                .save(any(Episode.class));
    }
    @Test
    void saveShouldRejectWhenSeasonDoesNotExist() {

        // ARRANGE
        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(999L);
        request.setEpisodeNumber(1);
        request.setTitle("Episodio de prueba");
        request.setDurationMinutes(24);

        when(
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        999L,
                        1
                )
        ).thenReturn(Optional.empty());

        when(seasonRepository.findById(999L))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> episodeService.save(request)
        );

        assertEquals(
                "Temporada no encontrada.",
                exception.getMessage()
        );

        verify(episodeRepository, never())
                .save(any(Episode.class));
    }
    @Test
    void findByIdShouldReturnEpisode() {

        // ARRANGE
        Long episodeId = 1L;

        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        Episode episode = new Episode();
        episode.setId(episodeId);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio 1");
        episode.setDescription("Descripción");
        episode.setDurationMinutes(24);
        episode.setThumbnail("poster.png");
        episode.setVideoUrl("episode.mp4");
        episode.setActive(true);
        episode.setSeason(season);

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        // ACT
        EpisodeResponseDTO response =
                episodeService.findById(episodeId);

        // ASSERT
        assertNotNull(response);

        assertEquals(episodeId, response.getId());
        assertEquals(1, response.getEpisodeNumber());
        assertEquals("Episodio 1", response.getTitle());
        assertEquals("Descripción", response.getDescription());
        assertEquals(24, response.getDurationMinutes());
        assertEquals("poster.png", response.getThumbnail());
        assertEquals("episode.mp4", response.getVideoUrl());
        assertTrue(response.getActive());
        assertEquals(1L, response.getSeasonId());
        assertEquals("Temporada 1", response.getSeasonTitle());

        verify(episodeRepository)
                .findById(episodeId);
    }
    @Test
    void findByIdShouldRejectWhenEpisodeDoesNotExist() {

        // ARRANGE
        Long episodeId = 999L;

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> episodeService.findById(episodeId)
        );

        assertEquals(
                "Episodio no encontrado.",
                exception.getMessage()
        );

        verify(episodeRepository)
                .findById(episodeId);
    }
    @Test
    void findAllShouldReturnAllEpisodes() {

        // ARRANGE
        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        Episode firstEpisode = new Episode();
        firstEpisode.setId(1L);
        firstEpisode.setEpisodeNumber(1);
        firstEpisode.setTitle("Episodio 1");
        firstEpisode.setDurationMinutes(24);
        firstEpisode.setActive(true);
        firstEpisode.setSeason(season);

        Episode secondEpisode = new Episode();
        secondEpisode.setId(2L);
        secondEpisode.setEpisodeNumber(2);
        secondEpisode.setTitle("Episodio 2");
        secondEpisode.setDurationMinutes(24);
        secondEpisode.setActive(true);
        secondEpisode.setSeason(season);

        when(episodeRepository.findAll())
                .thenReturn(List.of(firstEpisode, secondEpisode));

        // ACT
        List<EpisodeResponseDTO> response =
                episodeService.findAll();

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(1, response.get(0).getEpisodeNumber());
        assertEquals("Episodio 1", response.get(0).getTitle());

        assertEquals(2L, response.get(1).getId());
        assertEquals(2, response.get(1).getEpisodeNumber());
        assertEquals("Episodio 2", response.get(1).getTitle());

        assertEquals(1L, response.get(0).getSeasonId());
        assertEquals("Temporada 1", response.get(0).getSeasonTitle());

        verify(episodeRepository).findAll();
    }
    @Test
    void findBySeasonShouldReturnEpisodesForSeason() {

        // ARRANGE
        Long seasonId = 1L;

        Season season = new Season();
        season.setId(seasonId);
        season.setTitle("Temporada 1");

        Episode firstEpisode = new Episode();
        firstEpisode.setId(1L);
        firstEpisode.setEpisodeNumber(1);
        firstEpisode.setTitle("Episodio 1");
        firstEpisode.setDurationMinutes(24);
        firstEpisode.setActive(true);
        firstEpisode.setSeason(season);

        Episode secondEpisode = new Episode();
        secondEpisode.setId(2L);
        secondEpisode.setEpisodeNumber(2);
        secondEpisode.setTitle("Episodio 2");
        secondEpisode.setDurationMinutes(24);
        secondEpisode.setActive(true);
        secondEpisode.setSeason(season);

        when(episodeRepository.findBySeasonId(seasonId))
                .thenReturn(List.of(firstEpisode, secondEpisode));

        // ACT
        List<EpisodeResponseDTO> response =
                episodeService.findBySeason(seasonId);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(1, response.get(0).getEpisodeNumber());
        assertEquals("Episodio 1", response.get(0).getTitle());
        assertEquals(seasonId, response.get(0).getSeasonId());
        assertEquals("Temporada 1", response.get(0).getSeasonTitle());

        assertEquals(2L, response.get(1).getId());
        assertEquals(2, response.get(1).getEpisodeNumber());
        assertEquals("Episodio 2", response.get(1).getTitle());
        assertEquals(seasonId, response.get(1).getSeasonId());
        assertEquals("Temporada 1", response.get(1).getSeasonTitle());

        verify(episodeRepository)
                .findBySeasonId(seasonId);
    }
    @Test
    void updateShouldModifyExistingEpisode() {

        // ARRANGE
        Long episodeId = 1L;

        Season oldSeason = new Season();
        oldSeason.setId(1L);
        oldSeason.setTitle("Temporada 1");

        Season newSeason = new Season();
        newSeason.setId(2L);
        newSeason.setTitle("Temporada 2");

        Episode episode = new Episode();
        episode.setId(episodeId);
        episode.setEpisodeNumber(1);
        episode.setTitle("Título anterior");
        episode.setDescription("Descripción anterior");
        episode.setDurationMinutes(20);
        episode.setThumbnail("old-poster.png");
        episode.setVideoUrl("old-video.mp4");
        episode.setActive(true);
        episode.setSeason(oldSeason);

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(2L);
        request.setEpisodeNumber(3);
        request.setTitle("Título actualizado");
        request.setDescription("Descripción actualizada");
        request.setDurationMinutes(24);
        request.setThumbnail("new-poster.png");
        request.setVideoUrl("new-video.mp4");

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        when(seasonRepository.findById(2L))
                .thenReturn(Optional.of(newSeason));

        when(
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        2L,
                        3
                )
        ).thenReturn(Optional.empty());

        when(episodeRepository.save(any(Episode.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        EpisodeResponseDTO response =
                episodeService.update(episodeId, request);

        // ASSERT
        assertEquals(
                3,
                episode.getEpisodeNumber()
        );

        assertEquals(
                "Título actualizado",
                episode.getTitle()
        );

        assertEquals(
                "Descripción actualizada",
                episode.getDescription()
        );

        assertEquals(
                24,
                episode.getDurationMinutes()
        );

        assertEquals(
                "new-poster.png",
                episode.getThumbnail()
        );

        assertEquals(
                "new-video.mp4",
                episode.getVideoUrl()
        );

        assertEquals(
                newSeason,
                episode.getSeason()
        );

        assertEquals(
                "Título actualizado",
                response.getTitle()
        );

        assertEquals(
                2L,
                response.getSeasonId()
        );

        assertEquals(
                "Temporada 2",
                response.getSeasonTitle()
        );

        verify(episodeRepository)
                .save(episode);
    }
    @Test
    void updateShouldRejectWhenEpisodeDoesNotExist() {

        // ARRANGE
        Long episodeId = 999L;

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(1L);
        request.setEpisodeNumber(2);
        request.setTitle("Episodio actualizado");
        request.setDurationMinutes(24);

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> episodeService.update(episodeId, request)
        );

        assertEquals(
                "Episodio no encontrado.",
                exception.getMessage()
        );

        verify(seasonRepository, never())
                .findById(anyLong());

        verify(episodeRepository, never())
                .save(any(Episode.class));

        verifyNoInteractions(storageService);
    }
    @Test
    void updateShouldRejectDuplicateEpisodeNumber() {

        // ARRANGE
        Long episodeId = 1L;

        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        Episode episode = new Episode();
        episode.setId(episodeId);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio actual");
        episode.setDurationMinutes(24);
        episode.setSeason(season);

        Episode existingEpisode = new Episode();
        existingEpisode.setId(2L);
        existingEpisode.setEpisodeNumber(2);
        existingEpisode.setSeason(season);

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(1L);
        request.setEpisodeNumber(2);
        request.setTitle("Episodio actualizado");
        request.setDurationMinutes(24);

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        when(seasonRepository.findById(1L))
                .thenReturn(Optional.of(season));

        when(
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        1L,
                        2
                )
        ).thenReturn(Optional.of(existingEpisode));

        // ACT + ASSERT
        ResourceConflictException exception = assertThrows(
                ResourceConflictException.class,
                () -> episodeService.update(episodeId, request)
        );

        assertEquals(
                "El episodio ya existe en esta temporada.",
                exception.getMessage()
        );

        verify(episodeRepository, never())
                .save(any(Episode.class));

        verifyNoInteractions(storageService);
    }
    @Test
    void updateShouldDeleteOldFilesWhenFilesChange() {

        // ARRANGE
        Long episodeId = 1L;

        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        Episode episode = new Episode();
        episode.setId(episodeId);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio anterior");
        episode.setDurationMinutes(24);
        episode.setThumbnail("/uploads/images/old-poster.png");
        episode.setVideoUrl("/uploads/videos/old-video.mp4");
        episode.setSeason(season);

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(1L);
        request.setEpisodeNumber(1);
        request.setTitle("Episodio actualizado");
        request.setDurationMinutes(24);
        request.setThumbnail("/uploads/images/new-poster.png");
        request.setVideoUrl("/uploads/videos/new-video.mp4");

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        when(seasonRepository.findById(1L))
                .thenReturn(Optional.of(season));

        when(
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        1L,
                        1
                )
        ).thenReturn(Optional.of(episode));

        when(episodeRepository.save(any(Episode.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // ACT
        episodeService.update(episodeId, request);

        // ASSERT
        verify(episodeRepository).save(episode);

        verify(storageService)
                .deleteImage("old-poster.png");

        verify(storageService)
                .deleteVideo("old-video.mp4");
    }
    @Test
    void updateShouldRejectWhenSeasonDoesNotExist() {

        // ARRANGE
        Long episodeId = 1L;

        Episode episode = new Episode();
        episode.setId(episodeId);

        EpisodeRequestDTO request = new EpisodeRequestDTO();
        request.setSeasonId(999L);
        request.setEpisodeNumber(2);
        request.setTitle("Episodio actualizado");
        request.setDurationMinutes(24);

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        when(seasonRepository.findById(999L))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> episodeService.update(episodeId, request)
        );

        assertEquals(
                "Temporada no encontrada.",
                exception.getMessage()
        );

        verify(episodeRepository, never())
                .save(any(Episode.class));

        verifyNoInteractions(storageService);
    }
    @Test
    void deleteByIdShouldRejectEpisodeScheduledInProgramming() {

        // ARRANGE
        Long episodeId = 1L;

        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        Episode episode = new Episode();
        episode.setId(episodeId);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio programado");
        episode.setDurationMinutes(24);
        episode.setSeason(season);

        Schedule schedule = new Schedule();
        schedule.setId(10L);
        schedule.setEpisode(episode);

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        when(scheduleRepository.findByEpisodeId(episodeId))
                .thenReturn(List.of(schedule));

        // ACT + ASSERT
        ResourceConflictException exception = assertThrows(
                ResourceConflictException.class,
                () -> episodeService.deleteById(episodeId)
        );

        assertEquals(
                "No se puede eliminar el episodio porque está programado en la parrilla.",
                exception.getMessage()
        );

        verify(episodeRepository, never())
                .delete(any(Episode.class));

        verifyNoInteractions(storageService);
    }
    @Test
    void deleteByIdShouldDeleteEpisodeAndAssociatedFiles() {

        // ARRANGE
        Long episodeId = 1L;

        Season season = new Season();
        season.setId(1L);
        season.setTitle("Temporada 1");

        Episode episode = new Episode();
        episode.setId(episodeId);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio a eliminar");
        episode.setDurationMinutes(24);
        episode.setThumbnail("/uploads/images/poster.png");
        episode.setVideoUrl("/uploads/videos/episode.mp4");
        episode.setSeason(season);

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.of(episode));

        when(scheduleRepository.findByEpisodeId(episodeId))
                .thenReturn(List.of());

        // ACT
        episodeService.deleteById(episodeId);

        // ASSERT
        verify(episodeRepository)
                .delete(episode);

        verify(storageService)
                .deleteImage("poster.png");

        verify(storageService)
                .deleteVideo("episode.mp4");
    }
    @Test
    void deleteByIdShouldRejectWhenEpisodeDoesNotExist() {

        // ARRANGE
        Long episodeId = 999L;

        when(episodeRepository.findById(episodeId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> episodeService.deleteById(episodeId)
        );

        assertEquals(
                "Episodio no encontrado.",
                exception.getMessage()
        );

        verify(scheduleRepository, never())
                .findByEpisodeId(anyLong());

        verify(episodeRepository, never())
                .delete(any(Episode.class));

        verifyNoInteractions(storageService);
    }
}
