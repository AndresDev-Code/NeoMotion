package com.neomotion.service;

import com.neomotion.dto.PlaybackResponseDTO;
import com.neomotion.dto.PlaybackStateResponseDTO;
import com.neomotion.entity.Episode;
import com.neomotion.entity.MediaContent;
import com.neomotion.entity.Schedule;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.ScheduleRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class PlaybackServiceImpl implements PlaybackService {

    private final ScheduleRepository scheduleRepository;


    public PlaybackServiceImpl(
            ScheduleRepository scheduleRepository) {

        this.scheduleRepository =
                scheduleRepository;
    }


    // =================================================
    // OBTENER REPRODUCCIÓN ACTUAL
    // =================================================

    @Override
    public PlaybackResponseDTO getCurrentPlayback() {

        // =============================================
        // FECHA Y HORA DEL SERVIDOR
        // =============================================

        LocalDateTime serverDateTime =
                LocalDateTime.now();

        LocalDate currentDate =
                serverDateTime.toLocalDate();

        LocalTime currentTime =
                serverDateTime.toLocalTime();


        // =============================================
        // BUSCAR PROGRAMACIÓN ACTUAL
        // =============================================

        Schedule schedule =
                scheduleRepository
                        .findCurrentSchedule(
                                currentDate,
                                currentTime
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No hay ningún contenido reproduciéndose en este momento."
                                )
                        );


        // =============================================
        // SEGUNDOS TRANSCURRIDOS DESDE EL SCHEDULE
        // =============================================

        int elapsedSeconds =
                calcularSegundosTranscurridos(
                        schedule.getStartTime(),
                        currentTime
                );


        // =============================================
        // POSICIÓN ACTUAL DEL VIDEO
        // =============================================

        int currentPlaybackSeconds =
                schedule.getContentStartOffset()
                        + elapsedSeconds;


        // =============================================
        // NO SUPERAR EL FINAL DEL FRAGMENTO
        // =============================================

        currentPlaybackSeconds =
                Math.min(
                        currentPlaybackSeconds,
                        schedule.getContentEndOffset()
                );


        // =============================================
        // SEGUNDOS RESTANTES
        // =============================================

        int remainingSeconds =
                calcularSegundosRestantes(
                        currentPlaybackSeconds,
                        schedule.getContentEndOffset()
                );


        // =============================================
        // CREAR RESPUESTA
        // =============================================

        PlaybackResponseDTO response =
                crearPlaybackResponse(
                        schedule
                );


        response.setServerDateTime(
                serverDateTime
        );


        response.setCurrentPlaybackSeconds(
                currentPlaybackSeconds
        );


        response.setRemainingSeconds(
                remainingSeconds
        );


        return response;
    }


    // =================================================
    // OBTENER SIGUIENTE CONTENIDO
    // =================================================

    @Override
    public PlaybackResponseDTO getNextPlayback() {

        // =============================================
        // FECHA Y HORA DEL SERVIDOR
        // =============================================

        LocalDateTime serverDateTime =
                LocalDateTime.now();

        LocalDate currentDate =
                serverDateTime.toLocalDate();

        LocalTime currentTime =
                serverDateTime.toLocalTime();


        // =============================================
        // BUSCAR SIGUIENTE SCHEDULE
        // =============================================

        List<Schedule> schedules =
                scheduleRepository.findNextSchedule(
                        currentDate,
                        currentTime,
                        PageRequest.of(
                                0,
                                1
                        )
                );


        Schedule schedule =
                schedules.stream()
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No hay ningún contenido programado próximamente."
                                )
                        );


        // =============================================
        // CREAR RESPUESTA
        // =============================================

        PlaybackResponseDTO response =
                crearPlaybackResponse(
                        schedule
                );


        response.setServerDateTime(
                serverDateTime
        );


        // =============================================
        // EL SIGUIENTE CONTENIDO TODAVÍA NO EMPEZÓ
        // =============================================

        int playbackStart =
                schedule.getContentStartOffset();


        int playbackEnd =
                schedule.getContentEndOffset();


        response.setCurrentPlaybackSeconds(
                playbackStart
        );


        response.setRemainingSeconds(
                playbackEnd - playbackStart
        );


        return response;
    }


    // =================================================
    // ESTADO COMPLETO DEL CANAL
    // =================================================

    @Override
    public PlaybackStateResponseDTO getPlaybackState() {

        PlaybackStateResponseDTO response =
                new PlaybackStateResponseDTO();


        // =============================================
        // CONTENIDO ACTUAL
        // =============================================

        try {

            response.setCurrent(
                    getCurrentPlayback()
            );

        } catch (ResourceNotFoundException exception) {

            response.setCurrent(null);
        }


        // =============================================
        // SIGUIENTE CONTENIDO
        // =============================================

        try {

            response.setNext(
                    getNextPlayback()
            );

        } catch (ResourceNotFoundException exception) {

            response.setNext(null);
        }


        return response;
    }


    // =================================================
    // CREAR RESPUESTA BASE
    // =================================================

    private PlaybackResponseDTO crearPlaybackResponse(
            Schedule schedule) {

        PlaybackResponseDTO response =
                new PlaybackResponseDTO();


        // =============================================
        // PROGRAMACIÓN
        // =============================================

        response.setScheduleId(
                schedule.getId()
        );


        response.setAirDate(
                schedule.getAirDate()
        );


        response.setStartTime(
                schedule.getStartTime()
        );


        response.setEndTime(
                schedule.getEndTime()
        );


        // =============================================
        // FRAGMENTO
        // =============================================

        response.setPlaybackStartSeconds(
                schedule.getContentStartOffset()
        );


        response.setPlaybackEndSeconds(
                schedule.getContentEndOffset()
        );


        // =============================================
        // EPISODIO
        // =============================================

        if (schedule.getEpisode() != null) {

            Episode episode =
                    schedule.getEpisode();


            response.setContentType(
                    "EPISODE"
            );


            response.setTitle(
                    episode.getTitle()
            );


            response.setVideoUrl(
                    episode.getVideoUrl()
            );


            return response;
        }


        // =============================================
        // CONTENIDO MULTIMEDIA
        // =============================================

        if (schedule.getMediaContent() != null) {

            MediaContent mediaContent =
                    schedule.getMediaContent();


            response.setContentType(
                    "MEDIA_CONTENT"
            );


            response.setTitle(
                    mediaContent.getTitle()
            );


            response.setVideoUrl(
                    mediaContent.getVideoUrl()
            );


            return response;
        }


        // =============================================
        // PROGRAMACIÓN SIN CONTENIDO
        // =============================================

        throw new ResourceNotFoundException(
                "La programación no tiene contenido asociado."
        );
    }


    // =================================================
    // CALCULAR SEGUNDOS TRANSCURRIDOS
    // =================================================

    private int calcularSegundosTranscurridos(
            LocalTime startTime,
            LocalTime currentTime) {

        return (int) Duration
                .between(
                        startTime,
                        currentTime
                )
                .getSeconds();
    }


    // =================================================
    // CALCULAR SEGUNDOS RESTANTES
    // =================================================

    private int calcularSegundosRestantes(
            int currentPlaybackSeconds,
            int playbackEndSeconds) {

        return Math.max(
                playbackEndSeconds
                        - currentPlaybackSeconds,
                0
        );
    }
}