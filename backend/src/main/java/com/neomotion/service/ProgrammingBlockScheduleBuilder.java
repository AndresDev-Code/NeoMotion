package com.neomotion.service;

import com.neomotion.entity.Episode;
import com.neomotion.entity.MediaContent;
import com.neomotion.entity.ProgrammingBlock;
import com.neomotion.entity.ProgrammingBlockItem;
import com.neomotion.entity.Schedule;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.EpisodeRepository;
import com.neomotion.repository.MediaContentRepository;
import com.neomotion.repository.ProgrammingBlockItemRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class ProgrammingBlockScheduleBuilder {

    private final ProgrammingBlockItemRepository
            programmingBlockItemRepository;

    private final EpisodeRepository episodeRepository;

    private final MediaContentRepository mediaContentRepository;


    public ProgrammingBlockScheduleBuilder(
            ProgrammingBlockItemRepository programmingBlockItemRepository,
            EpisodeRepository episodeRepository,
            MediaContentRepository mediaContentRepository) {

        this.programmingBlockItemRepository =
                programmingBlockItemRepository;

        this.episodeRepository =
                episodeRepository;

        this.mediaContentRepository =
                mediaContentRepository;
    }


    // =================================================
    // CONSTRUIR SCHEDULES DEL BLOQUE
    // =================================================

    public List<Schedule> build(
            ProgrammingBlock block,
            LocalDate airDate,
            LocalTime startTime) {

        // =============================================
        // VALIDAR BLOQUE
        // =============================================

        if (block == null) {

            throw new ResourceNotFoundException(
                    "El bloque de programación no existe."
            );
        }


        if (!Boolean.TRUE.equals(block.getActive())) {

            throw new ResourceConflictException(
                    "No se puede construir un bloque inactivo."
            );
        }


        // =============================================
        // VALIDAR FECHA
        // =============================================

        if (airDate == null) {

            throw new ResourceConflictException(
                    "La fecha de transmisión es obligatoria."
            );
        }


        // =============================================
        // VALIDAR HORA
        // =============================================

        if (startTime == null) {

            throw new ResourceConflictException(
                    "La hora de inicio es obligatoria."
            );
        }


        // =============================================
        // OBTENER ITEMS
        // =============================================

        List<ProgrammingBlockItem> items =
                programmingBlockItemRepository
                        .findByProgrammingBlockIdOrderByPositionAsc(
                                block.getId()
                        );


        if (
                items == null ||
                        items.isEmpty()
        ) {

            throw new ResourceConflictException(
                    "El bloque no contiene elementos."
            );
        }


        // =============================================
        // ORDENAR ITEMS
        // =============================================

        items =
                items.stream()
                        .sorted(
                                Comparator.comparing(
                                        ProgrammingBlockItem::getPosition
                                )
                        )
                        .toList();


        // =============================================
        // PREPARAR RESULTADO
        // =============================================

        List<Schedule> schedules =
                new ArrayList<>();


        // =============================================
        // HORA ACTUAL DEL BLOQUE
        // =============================================

        LocalTime currentStartTime =
                startTime;


        // =============================================
        // CONSTRUIR CADA ITEM
        // =============================================

        for (
                ProgrammingBlockItem item :
                items
        ) {

            // =========================================
            // DURACIÓN TOTAL DEL CONTENIDO
            // =========================================

            int totalDurationSeconds =
                    obtenerDuracionTotal(item);


            // =========================================
            // OFFSET INICIAL
            // =========================================

            int startOffset =
                    item.getContentStartOffset() == null
                            ? 0
                            : item.getContentStartOffset();


            // =========================================
            // OFFSET FINAL
            // =========================================

            int endOffset;

            if (
                    item.getContentEndOffset() != null
            ) {

                endOffset =
                        item.getContentEndOffset();

            } else {

                endOffset =
                        totalDurationSeconds;
            }


            // =========================================
            // VALIDAR FRAGMENTO
            // =========================================

            validarFragmento(
                    startOffset,
                    endOffset,
                    totalDurationSeconds
            );


            // =========================================
            // DURACIÓN DEL ITEM
            // =========================================

            int durationSeconds =
                    endOffset -
                            startOffset;


            // =========================================
            // HORA FINAL
            // =========================================

            LocalTime endTime =
                    currentStartTime.plusSeconds(
                            durationSeconds
                    );


            // =========================================
            // VALIDAR QUE NO CAMBIE DE DÍA
            // =========================================

            if (
                    !endTime.isAfter(
                            currentStartTime
                    )
            ) {

                throw new ResourceConflictException(
                        "El bloque supera el límite del día."
                );
            }


            // =========================================
            // CREAR SCHEDULE
            // =========================================

            Schedule schedule =
                    new Schedule();

            schedule.setProgrammingBlock(
                    block
            );


            schedule.setAirDate(
                    airDate
            );


            schedule.setStartTime(
                    currentStartTime
            );


            schedule.setEndTime(
                    endTime
            );


            schedule.setActive(
                    true
            );


            schedule.setContentStartOffset(
                    startOffset
            );


            schedule.setContentEndOffset(
                    endOffset
            );


            // =========================================
            // ASIGNAR CONTENIDO
            // =========================================

            asignarContenido(
                    schedule,
                    item
            );


            // =========================================
            // AGREGAR RESULTADO
            // =========================================

            schedules.add(
                    schedule
            );


            // =========================================
            // SIGUIENTE HORA
            // =========================================

            currentStartTime =
                    endTime;
        }


        return schedules;
    }


    // =================================================
    // OBTENER DURACIÓN TOTAL
    // =================================================

    private int obtenerDuracionTotal(
            ProgrammingBlockItem item) {

        if (
                item.getEpisode() != null
        ) {

            Episode episode =
                    item.getEpisode();


            return episode
                    .getDurationMinutes() * 60;
        }


        if (
                item.getMediaContent() != null
        ) {

            MediaContent mediaContent =
                    item.getMediaContent();


            return mediaContent
                    .getDurationSeconds();
        }


        throw new ResourceConflictException(
                "Un elemento del bloque no tiene contenido asociado."
        );
    }


    // =================================================
    // VALIDAR FRAGMENTO
    // =================================================

    private void validarFragmento(
            int startOffset,
            int endOffset,
            int totalDurationSeconds) {

        if (
                startOffset < 0
        ) {

            throw new ResourceConflictException(
                    "El inicio del fragmento no puede ser negativo."
            );
        }


        if (
                startOffset >=
                        totalDurationSeconds
        ) {

            throw new ResourceConflictException(
                    "El inicio del fragmento está fuera " +
                            "de la duración del contenido."
            );
        }


        if (
                endOffset >
                        totalDurationSeconds
        ) {

            throw new ResourceConflictException(
                    "El final del fragmento supera la duración " +
                            "del contenido."
            );
        }


        if (
                endOffset <=
                        startOffset
        ) {

            throw new ResourceConflictException(
                    "El final del fragmento debe ser mayor " +
                            "que el inicio."
            );
        }
    }


    // =================================================
    // ASIGNAR CONTENIDO
    // =================================================

    private void asignarContenido(
            Schedule schedule,
            ProgrammingBlockItem item) {

        // =============================================
        // EPISODIO
        // =============================================

        if (
                item.getEpisode() != null
        ) {

            Episode episode =
                    episodeRepository
                            .findById(
                                    item.getEpisode()
                                            .getId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Episodio no encontrado."
                                    )
                            );


            schedule.setEpisode(
                    episode
            );


            schedule.setMediaContent(
                    null
            );


            return;
        }


        // =============================================
        // MEDIA CONTENT
        // =============================================

        if (
                item.getMediaContent() != null
        ) {

            MediaContent mediaContent =
                    mediaContentRepository
                            .findById(
                                    item.getMediaContent()
                                            .getId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Contenido multimedia no encontrado."
                                    )
                            );


            schedule.setMediaContent(
                    mediaContent
            );


            schedule.setEpisode(
                    null
            );


            return;
        }


        throw new ResourceConflictException(
                "El elemento del bloque no tiene contenido asociado."
        );
    }
}