package com.neomotion.service;

import com.neomotion.dto.ScheduleRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;
import com.neomotion.entity.Episode;
import com.neomotion.entity.Schedule;
import com.neomotion.repository.EpisodeRepository;
import com.neomotion.repository.MediaContentRepository;
import com.neomotion.repository.ScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.neomotion.entity.MediaContent;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import static org.mockito.ArgumentMatchers.eq;
import org.springframework.data.domain.Pageable;
import com.neomotion.dto.CurrentPlaybackResponseDTO;



import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceImplTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private EpisodeRepository episodeRepository;

    @Mock
    private MediaContentRepository mediaContentRepository;

    private ScheduleServiceImpl scheduleService;

    @BeforeEach
    void setUp() {

        scheduleService =
                new ScheduleServiceImpl(
                        scheduleRepository,
                        episodeRepository,
                        mediaContentRepository
                );
    }

    @Test
    void saveShouldCreateScheduleWithEpisode() {

        // =============================================
        // ARRANGE
        // =============================================

        LocalDate airDate =
                LocalDate.of(2026, 9, 12);

        LocalTime startTime =
                LocalTime.of(18, 0);

        Episode episode =
                new Episode();

        episode.setId(1L);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio de prueba");
        episode.setDurationMinutes(24);
        episode.setVideoUrl("video.mp4");

        ScheduleRequestDTO request =
                new ScheduleRequestDTO();

        request.setAirDate(airDate);
        request.setStartTime(startTime);
        request.setEpisodeId(1L);

        request.setContentStartOffset(null);
        request.setContentEndOffset(null);

        when(
                episodeRepository.findById(1L)
        ).thenReturn(
                Optional.of(episode)
        );

        when(
                scheduleRepository.findConflictingSchedules(
                        airDate,
                        startTime,
                        LocalTime.of(18, 24)
                )
        ).thenReturn(
                List.of()
        );

        when(
                scheduleRepository.save(
                        any(Schedule.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );


        // =============================================
        // ACT
        // =============================================

        ScheduleResponseDTO response =
                scheduleService.save(request);


        // =============================================
        // ASSERT
        // =============================================

        ArgumentCaptor<Schedule> captor =
                ArgumentCaptor.forClass(
                        Schedule.class
                );

        verify(
                scheduleRepository
        ).save(
                captor.capture()
        );

        Schedule savedSchedule =
                captor.getValue();


        // Fecha y horario
        assertEquals(
                airDate,
                savedSchedule.getAirDate()
        );

        assertEquals(
                startTime,
                savedSchedule.getStartTime()
        );

        assertEquals(
                LocalTime.of(18, 24),
                savedSchedule.getEndTime()
        );


        // Estado
        assertTrue(
                savedSchedule.getActive()
        );


        // Fragmento completo
        assertEquals(
                0,
                savedSchedule.getContentStartOffset()
        );

        assertEquals(
                1440,
                savedSchedule.getContentEndOffset()
        );


        // Contenido
        assertEquals(
                episode,
                savedSchedule.getEpisode()
        );

        assertNull(
                savedSchedule.getMediaContent()
        );


        // Response DTO
        assertEquals(
                airDate,
                response.getAirDate()
        );

        assertEquals(
                LocalTime.of(18, 24),
                response.getEndTime()
        );

        assertEquals(
                "EPISODE",
                response.getContentType()
        );

        assertEquals(
                1L,
                response.getEpisodeId()
        );

        assertEquals(
                "Episodio de prueba",
                response.getEpisodeTitle()
        );

        assertEquals(
                1440,
                response.getContentEndOffset()
        );
    }

    @Test
    void saveShouldCreateScheduleWithMediaContent() {

        // =============================================
        // ARRANGE
        // =============================================

        LocalDate airDate =
                LocalDate.of(2026, 9, 12);

        LocalTime startTime =
                LocalTime.of(18, 24);

        MediaContent mediaContent =
                new MediaContent();

        mediaContent.setId(1L);
        mediaContent.setTitle("Promo NeoMotion");
        mediaContent.setDurationSeconds(60);
        mediaContent.setVideoUrl("promo.mp4");

        ScheduleRequestDTO request =
                new ScheduleRequestDTO();

        request.setAirDate(airDate);
        request.setStartTime(startTime);
        request.setMediaContentId(1L);

        request.setContentStartOffset(null);
        request.setContentEndOffset(null);

        when(
                mediaContentRepository.findById(1L)
        ).thenReturn(
                Optional.of(mediaContent)
        );

        when(
                scheduleRepository.findConflictingSchedules(
                        airDate,
                        startTime,
                        LocalTime.of(18, 25)
                )
        ).thenReturn(
                List.of()
        );

        when(
                scheduleRepository.save(
                        any(Schedule.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );


        // =============================================
        // ACT
        // =============================================

        ScheduleResponseDTO response =
                scheduleService.save(request);


        // =============================================
        // ASSERT
        // =============================================

        ArgumentCaptor<Schedule> captor =
                ArgumentCaptor.forClass(
                        Schedule.class
                );

        verify(
                scheduleRepository
        ).save(
                captor.capture()
        );

        Schedule savedSchedule =
                captor.getValue();


        // Fecha y horario
        assertEquals(
                airDate,
                savedSchedule.getAirDate()
        );

        assertEquals(
                startTime,
                savedSchedule.getStartTime()
        );

        assertEquals(
                LocalTime.of(18, 25),
                savedSchedule.getEndTime()
        );


        // Estado
        assertTrue(
                savedSchedule.getActive()
        );


        // Fragmento completo
        assertEquals(
                0,
                savedSchedule.getContentStartOffset()
        );

        assertEquals(
                60,
                savedSchedule.getContentEndOffset()
        );


        // Contenido
        assertEquals(
                mediaContent,
                savedSchedule.getMediaContent()
        );

        assertNull(
                savedSchedule.getEpisode()
        );


        // Response DTO
        assertEquals(
                airDate,
                response.getAirDate()
        );

        assertEquals(
                LocalTime.of(18, 25),
                response.getEndTime()
        );

        assertEquals(
                "MEDIA_CONTENT",
                response.getContentType()
        );

        assertEquals(
                1L,
                response.getMediaContentId()
        );

        assertEquals(
                "Promo NeoMotion",
                response.getMediaContentTitle()
        );

        assertEquals(
                60,
                response.getContentEndOffset()
        );
    }
    @Test
    void saveShouldRejectConflictingSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 12);
        LocalTime startTime = LocalTime.of(19, 0);

        Episode episode = new Episode();
        episode.setId(1L);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio de prueba");
        episode.setDurationMinutes(24);
        episode.setVideoUrl("video.mp4");

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setStartTime(startTime);
        request.setEpisodeId(1L);
        request.setContentStartOffset(null);
        request.setContentEndOffset(null);

        when(episodeRepository.findById(1L))
                .thenReturn(Optional.of(episode));

        Schedule conflictingSchedule = new Schedule();

        when(scheduleRepository.findConflictingSchedules(
                airDate,
                startTime,
                LocalTime.of(19, 24)
        )).thenReturn(List.of(conflictingSchedule));

        // ACT + ASSERT
        assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.save(request)
        );

        verify(scheduleRepository, never())
                .save(any(Schedule.class));
    }
    @Test
    void saveShouldRejectEpisodeAndMediaContentTogether() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 12);
        LocalTime startTime = LocalTime.of(20, 0);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setStartTime(startTime);
        request.setEpisodeId(1L);
        request.setMediaContentId(1L);

        // ACT + ASSERT
        assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.save(request)
        );

        verifyNoInteractions(
                episodeRepository,
                mediaContentRepository,
                scheduleRepository
        );
    }
    @Test
    void saveShouldRejectScheduleWithoutContent() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 12);
        LocalTime startTime = LocalTime.of(21, 0);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setStartTime(startTime);
        request.setEpisodeId(null);
        request.setMediaContentId(null);

        // ACT + ASSERT
        assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.save(request)
        );

        verifyNoInteractions(
                episodeRepository,
                mediaContentRepository,
                scheduleRepository
        );
    }
    @Test
    void saveShouldRejectInvalidScheduleTime() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 12);
        LocalTime startTime = LocalTime.of(21, 0);

        Episode episode = new Episode();
        episode.setId(1L);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episodio de prueba");
        episode.setDurationMinutes(24);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setStartTime(startTime);
        request.setEpisodeId(1L);

        request.setContentStartOffset(10);
        request.setContentEndOffset(5);

        when(episodeRepository.findById(1L))
                .thenReturn(Optional.of(episode));

        // ACT + ASSERT
        assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.save(request)
        );

        verify(scheduleRepository, never())
                .save(any(Schedule.class));
    }
    @Test
    void saveNextShouldStartAtMidnightWhenThereIsNoPreviousSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 13);

        Episode episode = new Episode();
        episode.setId(2L);
        episode.setEpisodeNumber(1);
        episode.setTitle("Primer programa del día");
        episode.setDurationMinutes(24);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setEpisodeId(2L);

        when(scheduleRepository.findTopByAirDateOrderByEndTimeDesc(airDate))
                .thenReturn(Optional.empty());

        when(episodeRepository.findById(2L))
                .thenReturn(Optional.of(episode));

        when(scheduleRepository.findConflictingSchedules(
                airDate,
                LocalTime.MIDNIGHT,
                LocalTime.of(0, 24)
        )).thenReturn(List.of());

        when(scheduleRepository.save(any(Schedule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        ScheduleResponseDTO response = scheduleService.saveNext(request);

        // ASSERT
        ArgumentCaptor<Schedule> captor =
                ArgumentCaptor.forClass(Schedule.class);

        verify(scheduleRepository).save(captor.capture());

        Schedule savedSchedule = captor.getValue();

        assertEquals(airDate, savedSchedule.getAirDate());
        assertEquals(LocalTime.MIDNIGHT, savedSchedule.getStartTime());
        assertEquals(LocalTime.of(0, 24), savedSchedule.getEndTime());
        assertEquals(episode, savedSchedule.getEpisode());
        assertNull(savedSchedule.getMediaContent());

        assertEquals(LocalTime.MIDNIGHT, response.getStartTime());
        assertEquals(LocalTime.of(0, 24), response.getEndTime());
    }
    @Test
    void saveNextShouldStartAfterLastSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 13);

        Schedule lastSchedule = new Schedule();
        lastSchedule.setAirDate(airDate);
        lastSchedule.setStartTime(LocalTime.of(18, 0));
        lastSchedule.setEndTime(LocalTime.of(18, 24));

        Episode episode = new Episode();
        episode.setId(3L);
        episode.setEpisodeNumber(2);
        episode.setTitle("Siguiente episodio");
        episode.setDurationMinutes(24);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setEpisodeId(3L);

        when(scheduleRepository.findTopByAirDateOrderByEndTimeDesc(airDate))
                .thenReturn(Optional.of(lastSchedule));

        when(episodeRepository.findById(3L))
                .thenReturn(Optional.of(episode));

        when(scheduleRepository.findConflictingSchedules(
                airDate,
                LocalTime.of(18, 24),
                LocalTime.of(18, 48)
        )).thenReturn(List.of());

        when(scheduleRepository.save(any(Schedule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        ScheduleResponseDTO response = scheduleService.saveNext(request);

        // ASSERT
        ArgumentCaptor<Schedule> captor =
                ArgumentCaptor.forClass(Schedule.class);

        verify(scheduleRepository).save(captor.capture());

        Schedule savedSchedule = captor.getValue();

        assertEquals(airDate, savedSchedule.getAirDate());
        assertEquals(LocalTime.of(18, 24), savedSchedule.getStartTime());
        assertEquals(LocalTime.of(18, 48), savedSchedule.getEndTime());
        assertEquals(episode, savedSchedule.getEpisode());
        assertNull(savedSchedule.getMediaContent());

        assertEquals(LocalTime.of(18, 24), response.getStartTime());
        assertEquals(LocalTime.of(18, 48), response.getEndTime());
    }
    @Test
    void saveNextShouldCreateScheduleWithMediaContent() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 13);

        Schedule lastSchedule = new Schedule();
        lastSchedule.setAirDate(airDate);
        lastSchedule.setStartTime(LocalTime.of(19, 0));
        lastSchedule.setEndTime(LocalTime.of(19, 24));

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(4L);
        mediaContent.setTitle("Promo NeoMotion");
        mediaContent.setDurationSeconds(60);
        mediaContent.setVideoUrl("promo.mp4");

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setMediaContentId(4L);

        when(scheduleRepository.findTopByAirDateOrderByEndTimeDesc(airDate))
                .thenReturn(Optional.of(lastSchedule));

        when(mediaContentRepository.findById(4L))
                .thenReturn(Optional.of(mediaContent));

        when(scheduleRepository.findConflictingSchedules(
                airDate,
                LocalTime.of(19, 24),
                LocalTime.of(19, 25)
        )).thenReturn(List.of());

        when(scheduleRepository.save(any(Schedule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        ScheduleResponseDTO response = scheduleService.saveNext(request);

        // ASSERT
        ArgumentCaptor<Schedule> captor =
                ArgumentCaptor.forClass(Schedule.class);

        verify(scheduleRepository).save(captor.capture());

        Schedule savedSchedule = captor.getValue();

        assertEquals(airDate, savedSchedule.getAirDate());
        assertEquals(LocalTime.of(19, 24), savedSchedule.getStartTime());
        assertEquals(LocalTime.of(19, 25), savedSchedule.getEndTime());
        assertEquals(mediaContent, savedSchedule.getMediaContent());
        assertNull(savedSchedule.getEpisode());

        assertEquals(LocalTime.of(19, 24), response.getStartTime());
        assertEquals(LocalTime.of(19, 25), response.getEndTime());
        assertEquals("MEDIA_CONTENT", response.getContentType());
        assertEquals(4L, response.getMediaContentId());
        assertEquals("Promo NeoMotion", response.getMediaContentTitle());
    }
    @Test
    void saveNextShouldRejectScheduleThatCrossesMidnight() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 13);

        Schedule lastSchedule = new Schedule();
        lastSchedule.setAirDate(airDate);
        lastSchedule.setStartTime(LocalTime.of(23, 30));
        lastSchedule.setEndTime(LocalTime.of(23, 50));

        Episode episode = new Episode();
        episode.setId(5L);
        episode.setEpisodeNumber(3);
        episode.setTitle("Episodio demasiado largo");
        episode.setDurationMinutes(30);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setEpisodeId(5L);

        when(scheduleRepository.findTopByAirDateOrderByEndTimeDesc(airDate))
                .thenReturn(Optional.of(lastSchedule));

        when(episodeRepository.findById(5L))
                .thenReturn(Optional.of(episode));

        // ACT + ASSERT
        assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.saveNext(request)
        );

        verify(scheduleRepository, never())
                .save(any(Schedule.class));
    }
    @Test
    void updateShouldModifyExistingSchedule() {

        // ARRANGE
        Long scheduleId = 1L;
        LocalDate airDate = LocalDate.of(2026, 9, 14);

        Schedule existingSchedule = new Schedule();
        existingSchedule.setId(scheduleId);
        existingSchedule.setAirDate(airDate);
        existingSchedule.setStartTime(LocalTime.of(18, 0));
        existingSchedule.setEndTime(LocalTime.of(18, 24));

        Episode episode = new Episode();
        episode.setId(6L);
        episode.setEpisodeNumber(4);
        episode.setTitle("Episodio actualizado");
        episode.setDurationMinutes(24);
        episode.setVideoUrl("updated.mp4");

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setStartTime(LocalTime.of(20, 0));
        request.setEpisodeId(6L);

        when(scheduleRepository.findById(scheduleId))
                .thenReturn(Optional.of(existingSchedule));

        when(episodeRepository.findById(6L))
                .thenReturn(Optional.of(episode));

        when(scheduleRepository.findConflictingSchedulesForUpdate(
                airDate,
                LocalTime.of(20, 0),
                LocalTime.of(20, 24),
                scheduleId
        )).thenReturn(List.of());

        when(scheduleRepository.save(any(Schedule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        ScheduleResponseDTO response =
                scheduleService.update(scheduleId, request);

        // ASSERT
        verify(scheduleRepository).save(existingSchedule);

        assertEquals(airDate, existingSchedule.getAirDate());
        assertEquals(LocalTime.of(20, 0), existingSchedule.getStartTime());
        assertEquals(LocalTime.of(20, 24), existingSchedule.getEndTime());
        assertEquals(episode, existingSchedule.getEpisode());
        assertNull(existingSchedule.getMediaContent());

        assertEquals(LocalTime.of(20, 0), response.getStartTime());
        assertEquals(LocalTime.of(20, 24), response.getEndTime());
        assertEquals("EPISODE", response.getContentType());
        assertEquals(6L, response.getEpisodeId());
        assertEquals("Episodio actualizado", response.getEpisodeTitle());
    }
    @Test
    void updateShouldRejectWhenScheduleDoesNotExist() {

        // ARRANGE
        Long scheduleId = 999L;

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(LocalDate.of(2026, 9, 14));
        request.setStartTime(LocalTime.of(20, 0));
        request.setEpisodeId(6L);

        when(scheduleRepository.findById(scheduleId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> scheduleService.update(scheduleId, request)
        );

        assertEquals(
                "Horario no encontrado.",
                exception.getMessage()
        );

        verify(scheduleRepository, never())
                .save(any(Schedule.class));
    }
    @Test
    void updateShouldRejectConflictingSchedule() {

        // ARRANGE
        Long scheduleId = 1L;
        LocalDate airDate = LocalDate.of(2026, 9, 14);

        Schedule existingSchedule = new Schedule();
        existingSchedule.setId(scheduleId);
        existingSchedule.setAirDate(airDate);
        existingSchedule.setStartTime(LocalTime.of(18, 0));
        existingSchedule.setEndTime(LocalTime.of(18, 24));

        Episode episode = new Episode();
        episode.setId(7L);
        episode.setEpisodeNumber(5);
        episode.setTitle("Episodio actualizado");
        episode.setDurationMinutes(24);

        Schedule conflictingSchedule = new Schedule();
        conflictingSchedule.setId(2L);

        ScheduleRequestDTO request = new ScheduleRequestDTO();
        request.setAirDate(airDate);
        request.setStartTime(LocalTime.of(20, 0));
        request.setEpisodeId(7L);

        when(scheduleRepository.findById(scheduleId))
                .thenReturn(Optional.of(existingSchedule));

        when(episodeRepository.findById(7L))
                .thenReturn(Optional.of(episode));

        when(scheduleRepository.findConflictingSchedulesForUpdate(
                airDate,
                LocalTime.of(20, 0),
                LocalTime.of(20, 24),
                scheduleId
        )).thenReturn(List.of(conflictingSchedule));

        // ACT + ASSERT
        assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.update(scheduleId, request)
        );

        verify(scheduleRepository, never())
                .save(any(Schedule.class));
    }
    @Test
    void deleteByIdShouldDeleteExistingSchedule() {

        // ARRANGE
        Long scheduleId = 1L;

        when(scheduleRepository.existsById(scheduleId))
                .thenReturn(true);

        // ACT
        scheduleService.deleteById(scheduleId);

        // ASSERT
        verify(scheduleRepository).existsById(scheduleId);
        verify(scheduleRepository).deleteById(scheduleId);
    }
    @Test
    void deleteByIdShouldRejectWhenScheduleDoesNotExist() {

        // ARRANGE
        Long scheduleId = 999L;

        when(scheduleRepository.existsById(scheduleId))
                .thenReturn(false);

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> scheduleService.deleteById(scheduleId)
        );

        assertEquals(
                "Horario no encontrado.",
                exception.getMessage()
        );

        verify(scheduleRepository, never())
                .deleteById(scheduleId);
    }
    @Test
    void findByIdShouldReturnSchedule() {

        // ARRANGE
        Long scheduleId = 1L;
        LocalDate airDate = LocalDate.of(2026, 9, 15);

        Schedule schedule = new Schedule();
        schedule.setId(scheduleId);
        schedule.setAirDate(airDate);
        schedule.setStartTime(LocalTime.of(18, 0));
        schedule.setEndTime(LocalTime.of(18, 24));

        when(scheduleRepository.findById(scheduleId))
                .thenReturn(Optional.of(schedule));

        // ACT
        ScheduleResponseDTO response =
                scheduleService.findById(scheduleId);

        // ASSERT
        assertNotNull(response);
        assertEquals(scheduleId, response.getId());
        assertEquals(airDate, response.getAirDate());
        assertEquals(LocalTime.of(18, 0), response.getStartTime());
        assertEquals(LocalTime.of(18, 24), response.getEndTime());

        verify(scheduleRepository).findById(scheduleId);
    }
    @Test
    void findByIdShouldRejectWhenScheduleDoesNotExist() {

        // ARRANGE
        Long scheduleId = 999L;

        when(scheduleRepository.findById(scheduleId))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> scheduleService.findById(scheduleId)
        );

        assertEquals(
                "Horario no encontrado.",
                exception.getMessage()
        );
    }
    @Test
    void findAllShouldReturnAllSchedules() {

        // ARRANGE
        LocalDate firstDate = LocalDate.of(2026, 9, 15);
        LocalDate secondDate = LocalDate.of(2026, 9, 16);

        Schedule firstSchedule = new Schedule();
        firstSchedule.setId(1L);
        firstSchedule.setAirDate(firstDate);
        firstSchedule.setStartTime(LocalTime.of(18, 0));
        firstSchedule.setEndTime(LocalTime.of(18, 24));

        Schedule secondSchedule = new Schedule();
        secondSchedule.setId(2L);
        secondSchedule.setAirDate(secondDate);
        secondSchedule.setStartTime(LocalTime.of(19, 0));
        secondSchedule.setEndTime(LocalTime.of(19, 24));

        when(scheduleRepository.findAllByOrderByAirDateAscStartTimeAsc())
                .thenReturn(List.of(firstSchedule, secondSchedule));

        // ACT
        List<ScheduleResponseDTO> response =
                scheduleService.findAll();

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(firstDate, response.get(0).getAirDate());
        assertEquals(LocalTime.of(18, 0), response.get(0).getStartTime());

        assertEquals(2L, response.get(1).getId());
        assertEquals(secondDate, response.get(1).getAirDate());
        assertEquals(LocalTime.of(19, 0), response.get(1).getStartTime());

        verify(scheduleRepository)
                .findAllByOrderByAirDateAscStartTimeAsc();
    }
    @Test
    void findByAirDateShouldReturnSchedulesForDate() {

        // ARRANGE
        LocalDate airDate = LocalDate.of(2026, 9, 15);

        Schedule firstSchedule = new Schedule();
        firstSchedule.setId(1L);
        firstSchedule.setAirDate(airDate);
        firstSchedule.setStartTime(LocalTime.of(18, 0));
        firstSchedule.setEndTime(LocalTime.of(18, 24));

        Schedule secondSchedule = new Schedule();
        secondSchedule.setId(2L);
        secondSchedule.setAirDate(airDate);
        secondSchedule.setStartTime(LocalTime.of(19, 0));
        secondSchedule.setEndTime(LocalTime.of(19, 24));

        when(scheduleRepository.findByAirDateOrderByStartTimeAsc(airDate))
                .thenReturn(List.of(firstSchedule, secondSchedule));

        // ACT
        List<ScheduleResponseDTO> response =
                scheduleService.findByAirDate(airDate);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(airDate, response.get(0).getAirDate());
        assertEquals(LocalTime.of(18, 0), response.get(0).getStartTime());

        assertEquals(2L, response.get(1).getId());
        assertEquals(airDate, response.get(1).getAirDate());
        assertEquals(LocalTime.of(19, 0), response.get(1).getStartTime());

        verify(scheduleRepository)
                .findByAirDateOrderByStartTimeAsc(airDate);
    }
    @Test
    void findByDateRangeShouldReturnSchedulesWithinRange() {

        // ARRANGE
        LocalDate startDate = LocalDate.of(2026, 9, 15);
        LocalDate endDate = LocalDate.of(2026, 9, 17);

        Schedule firstSchedule = new Schedule();
        firstSchedule.setId(1L);
        firstSchedule.setAirDate(LocalDate.of(2026, 9, 15));
        firstSchedule.setStartTime(LocalTime.of(18, 0));
        firstSchedule.setEndTime(LocalTime.of(18, 24));

        Schedule secondSchedule = new Schedule();
        secondSchedule.setId(2L);
        secondSchedule.setAirDate(LocalDate.of(2026, 9, 16));
        secondSchedule.setStartTime(LocalTime.of(19, 0));
        secondSchedule.setEndTime(LocalTime.of(19, 24));

        when(scheduleRepository
                .findByAirDateBetweenOrderByAirDateAscStartTimeAsc(
                        startDate,
                        endDate
                ))
                .thenReturn(List.of(firstSchedule, secondSchedule));

        // ACT
        List<ScheduleResponseDTO> response =
                scheduleService.findByDateRange(startDate, endDate);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(
                LocalDate.of(2026, 9, 15),
                response.get(0).getAirDate()
        );

        assertEquals(2L, response.get(1).getId());
        assertEquals(
                LocalDate.of(2026, 9, 16),
                response.get(1).getAirDate()
        );

        verify(scheduleRepository)
                .findByAirDateBetweenOrderByAirDateAscStartTimeAsc(
                        startDate,
                        endDate
                );
    }
    @Test
    void findByDateRangeShouldRejectInvalidDateRange() {

        // ARRANGE
        LocalDate startDate = LocalDate.of(2026, 9, 17);
        LocalDate endDate = LocalDate.of(2026, 9, 15);

        // ACT + ASSERT
        ResourceConflictException exception = assertThrows(
                ResourceConflictException.class,
                () -> scheduleService.findByDateRange(startDate, endDate)
        );

        assertEquals(
                "La fecha final no puede ser anterior a la fecha inicial.",
                exception.getMessage()
        );

        verifyNoInteractions(scheduleRepository);
    }
    @Test
    void findByEpisodeShouldReturnSchedulesForEpisode() {

        // ARRANGE
        Long episodeId = 10L;

        Schedule firstSchedule = new Schedule();
        firstSchedule.setId(1L);
        firstSchedule.setAirDate(LocalDate.of(2026, 9, 15));
        firstSchedule.setStartTime(LocalTime.of(18, 0));
        firstSchedule.setEndTime(LocalTime.of(18, 24));

        Schedule secondSchedule = new Schedule();
        secondSchedule.setId(2L);
        secondSchedule.setAirDate(LocalDate.of(2026, 9, 16));
        secondSchedule.setStartTime(LocalTime.of(20, 0));
        secondSchedule.setEndTime(LocalTime.of(20, 24));

        when(scheduleRepository.findByEpisodeId(episodeId))
                .thenReturn(List.of(firstSchedule, secondSchedule));

        // ACT
        List<ScheduleResponseDTO> response =
                scheduleService.findByEpisode(episodeId);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(
                LocalDate.of(2026, 9, 15),
                response.get(0).getAirDate()
        );

        assertEquals(2L, response.get(1).getId());
        assertEquals(
                LocalDate.of(2026, 9, 16),
                response.get(1).getAirDate()
        );

        verify(scheduleRepository).findByEpisodeId(episodeId);
    }
    @Test
    void findByMediaContentShouldReturnSchedulesForMediaContent() {

        // ARRANGE
        Long mediaContentId = 20L;

        Schedule firstSchedule = new Schedule();
        firstSchedule.setId(1L);
        firstSchedule.setAirDate(LocalDate.of(2026, 9, 15));
        firstSchedule.setStartTime(LocalTime.of(18, 30));
        firstSchedule.setEndTime(LocalTime.of(18, 31));

        Schedule secondSchedule = new Schedule();
        secondSchedule.setId(2L);
        secondSchedule.setAirDate(LocalDate.of(2026, 9, 16));
        secondSchedule.setStartTime(LocalTime.of(20, 0));
        secondSchedule.setEndTime(LocalTime.of(20, 1));

        when(scheduleRepository.findByMediaContentId(mediaContentId))
                .thenReturn(List.of(firstSchedule, secondSchedule));

        // ACT
        List<ScheduleResponseDTO> response =
                scheduleService.findByMediaContent(mediaContentId);

        // ASSERT
        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).getId());
        assertEquals(
                LocalDate.of(2026, 9, 15),
                response.get(0).getAirDate()
        );
        assertEquals(
                LocalTime.of(18, 30),
                response.get(0).getStartTime()
        );

        assertEquals(2L, response.get(1).getId());
        assertEquals(
                LocalDate.of(2026, 9, 16),
                response.get(1).getAirDate()
        );
        assertEquals(
                LocalTime.of(20, 0),
                response.get(1).getStartTime()
        );

        verify(scheduleRepository)
                .findByMediaContentId(mediaContentId);
    }
    @Test
    void findCurrentShouldReturnCurrentSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        Schedule schedule = new Schedule();
        schedule.setId(1L);
        schedule.setAirDate(airDate);
        schedule.setStartTime(currentTime.minusMinutes(10));
        schedule.setEndTime(currentTime.plusMinutes(10));

        when(scheduleRepository.findCurrentSchedule(
                airDate,
                currentTime
        )).thenReturn(Optional.of(schedule));

        // ACT
        ScheduleResponseDTO response =
                scheduleService.findCurrent();

        // ASSERT
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(airDate, response.getAirDate());
        assertEquals(
                currentTime.minusMinutes(10),
                response.getStartTime()
        );
        assertEquals(
                currentTime.plusMinutes(10),
                response.getEndTime()
        );

        verify(scheduleRepository)
                .findCurrentSchedule(airDate, currentTime);
    }
    @Test
    void findCurrentShouldRejectWhenThereIsNoCurrentSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.now();

        when(scheduleRepository.findCurrentSchedule(
                eq(airDate),
                any(LocalTime.class)
        )).thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> scheduleService.findCurrent()
        );

        assertEquals(
                "No hay ningún programa transmitiéndose en este momento.",
                exception.getMessage()
        );

        verify(scheduleRepository)
                .findCurrentSchedule(
                        eq(airDate),
                        any(LocalTime.class)
                );
    }

    @Test
    void findNextShouldReturnNextSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.now();

        Schedule nextSchedule = new Schedule();
        nextSchedule.setId(10L);
        nextSchedule.setAirDate(airDate);
        nextSchedule.setStartTime(LocalTime.of(19, 0));
        nextSchedule.setEndTime(LocalTime.of(19, 24));

        when(scheduleRepository.findNextSchedule(
                eq(airDate),
                any(LocalTime.class),
                any(Pageable.class)
        )).thenReturn(List.of(nextSchedule));

        // ACT
        ScheduleResponseDTO response =
                scheduleService.findNext();

        // ASSERT
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals(airDate, response.getAirDate());
        assertEquals(LocalTime.of(19, 0), response.getStartTime());
        assertEquals(LocalTime.of(19, 24), response.getEndTime());

        verify(scheduleRepository).findNextSchedule(
                eq(airDate),
                any(LocalTime.class),
                any(Pageable.class)
        );
    }
    @Test
    void findNextShouldRejectWhenThereIsNoNextSchedule() {

        // ARRANGE
        LocalDate airDate = LocalDate.now();

        when(scheduleRepository.findNextSchedule(
                eq(airDate),
                any(LocalTime.class),
                any(Pageable.class)
        )).thenReturn(List.of());

        // ACT + ASSERT
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> scheduleService.findNext()
        );

        assertEquals(
                "No hay ningún programa programado próximamente.",
                exception.getMessage()
        );

        verify(scheduleRepository).findNextSchedule(
                eq(airDate),
                any(LocalTime.class),
                any(Pageable.class)
        );
    }
    @Test
    void findCurrentPlaybackShouldReturnCurrentEpisodePlayback() {

        // ARRANGE
        LocalDate airDate = LocalDate.now();

        Episode episode = new Episode();
        episode.setId(11L);
        episode.setEpisodeNumber(1);
        episode.setTitle("Episode playback");
        episode.setDurationMinutes(24);
        episode.setVideoUrl("episode.mp4");

        Schedule schedule = new Schedule();
        schedule.setId(100L);
        schedule.setAirDate(airDate);
        schedule.setStartTime(LocalTime.now().minusMinutes(2));
        schedule.setEndTime(LocalTime.now().plusMinutes(22));
        schedule.setContentStartOffset(0);
        schedule.setContentEndOffset(1440);
        schedule.setEpisode(episode);
        schedule.setMediaContent(null);

        when(scheduleRepository.findCurrentSchedule(
                eq(airDate),
                any(LocalTime.class)
        )).thenReturn(Optional.of(schedule));

        // ACT
        CurrentPlaybackResponseDTO response =
                scheduleService.findCurrentPlayback();

        // ASSERT
        assertNotNull(response);

        assertEquals(100L, response.getScheduleId());
        assertEquals("EPISODE", response.getContentType());
        assertEquals("Episode playback", response.getTitle());
        assertEquals("episode.mp4", response.getVideoUrl());

        assertNotNull(response.getPlaybackStartSeconds());
        assertTrue(response.getPlaybackStartSeconds() >= 0);

        assertEquals(
                1440,
                response.getPlaybackEndSeconds()
        );

        verify(scheduleRepository).findCurrentSchedule(
                eq(airDate),
                any(LocalTime.class)
        );
    }
    @Test
    void findCurrentPlaybackShouldReturnCurrentMediaContentPlayback() {

        // ARRANGE
        LocalDate airDate = LocalDate.now();

        MediaContent mediaContent = new MediaContent();
        mediaContent.setId(12L);
        mediaContent.setTitle("Promo NeoMotion");
        mediaContent.setDurationSeconds(60);
        mediaContent.setVideoUrl("promo.mp4");

        Schedule schedule = new Schedule();
        schedule.setId(101L);
        schedule.setAirDate(airDate);
        schedule.setStartTime(LocalTime.now().minusSeconds(20));
        schedule.setEndTime(LocalTime.now().plusSeconds(40));
        schedule.setContentStartOffset(0);
        schedule.setContentEndOffset(60);
        schedule.setEpisode(null);
        schedule.setMediaContent(mediaContent);

        when(scheduleRepository.findCurrentSchedule(
                eq(airDate),
                any(LocalTime.class)
        )).thenReturn(Optional.of(schedule));

        // ACT
        CurrentPlaybackResponseDTO response =
                scheduleService.findCurrentPlayback();

        // ASSERT
        assertNotNull(response);

        assertEquals(101L, response.getScheduleId());
        assertEquals("MEDIA_CONTENT", response.getContentType());
        assertEquals("Promo NeoMotion", response.getTitle());
        assertEquals("promo.mp4", response.getVideoUrl());

        assertNotNull(response.getPlaybackStartSeconds());
        assertTrue(response.getPlaybackStartSeconds() >= 0);

        assertEquals(
                60,
                response.getPlaybackEndSeconds()
        );

        verify(scheduleRepository).findCurrentSchedule(
                eq(airDate),
                any(LocalTime.class)
        );
    }
}