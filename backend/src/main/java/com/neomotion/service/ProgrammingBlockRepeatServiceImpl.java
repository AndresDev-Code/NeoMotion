package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockRepeatRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;
import com.neomotion.entity.ProgrammingBlock;
import com.neomotion.entity.Schedule;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.ProgrammingBlockRepository;
import com.neomotion.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProgrammingBlockRepeatServiceImpl
        implements ProgrammingBlockRepeatService {

    private final ProgrammingBlockRepository
            programmingBlockRepository;

    private final ScheduleRepository
            scheduleRepository;

    private final ProgrammingBlockScheduleBuilder
            programmingBlockScheduleBuilder;


    public ProgrammingBlockRepeatServiceImpl(
            ProgrammingBlockRepository programmingBlockRepository,
            ScheduleRepository scheduleRepository,
            ProgrammingBlockScheduleBuilder programmingBlockScheduleBuilder) {

        this.programmingBlockRepository =
                programmingBlockRepository;

        this.scheduleRepository =
                scheduleRepository;

        this.programmingBlockScheduleBuilder =
                programmingBlockScheduleBuilder;
    }


    // =================================================
    // REPETIR BLOQUE
    // =================================================

    @Override
    @Transactional
    public List<ScheduleResponseDTO> repeat(
            ProgrammingBlockRepeatRequestDTO request) {

        // =============================================
        // VALIDAR REQUEST
        // =============================================

        if (request == null) {

            throw new ResourceConflictException(
                    "La solicitud de repetición es obligatoria."
            );
        }


        // =============================================
        // VALIDAR BLOQUE
        // =============================================

        if (request.getBlockId() == null) {

            throw new ResourceConflictException(
                    "El bloque de programación es obligatorio."
            );
        }


        // =============================================
        // VALIDAR FECHAS
        // =============================================

        LocalDate startDate =
                request.getStartDate();

        LocalDate endDate =
                request.getEndDate();


        if (startDate == null) {

            throw new ResourceConflictException(
                    "La fecha inicial es obligatoria."
            );
        }


        if (endDate == null) {

            throw new ResourceConflictException(
                    "La fecha final es obligatoria."
            );
        }


        if (
                endDate.isBefore(
                        startDate
                )
        ) {

            throw new ResourceConflictException(
                    "La fecha final no puede ser anterior " +
                            "a la fecha inicial."
            );
        }


        // =============================================
        // VALIDAR HORA
        // =============================================

        LocalTime startTime =
                request.getStartTime();


        if (startTime == null) {

            throw new ResourceConflictException(
                    "La hora de inicio es obligatoria."
            );
        }


        // =============================================
        // VALIDAR DÍAS
        // =============================================

        List<DayOfWeek> daysOfWeek =
                request.getDaysOfWeek();


        if (
                daysOfWeek == null ||
                        daysOfWeek.isEmpty()
        ) {

            throw new ResourceConflictException(
                    "Debes seleccionar al menos un día " +
                            "de la semana."
            );
        }


        // =============================================
        // BUSCAR BLOQUE
        // =============================================

        ProgrammingBlock block =
                programmingBlockRepository
                        .findById(
                                request.getBlockId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bloque de programación no encontrado."
                                )
                        );


        // =============================================
        // VALIDAR BLOQUE ACTIVO
        // =============================================

        if (
                !Boolean.TRUE.equals(
                        block.getActive()
                )
        ) {

            throw new ResourceConflictException(
                    "No se puede repetir un bloque inactivo."
            );
        }


        // =================================================
        // IMPORTANTE:
        // AQUÍ TODAVÍA NO SE GUARDA NADA
        // =================================================

        List<Schedule> allSchedulesToCreate =
                new ArrayList<>();


        // =============================================
        // RECORRER TODAS LAS FECHAS
        // =============================================

        LocalDate currentDate =
                startDate;


        while (
                !currentDate.isAfter(
                        endDate
                )
        ) {

            // =========================================
            // ¿ESTE DÍA FUE SELECCIONADO?
            // =========================================

            if (
                    daysOfWeek.contains(
                            currentDate.getDayOfWeek()
                    )
            ) {

                // =====================================
                // CONSTRUIR BLOQUE EN MEMORIA
                // =====================================

                List<Schedule> schedules =
                        programmingBlockScheduleBuilder.build(
                                block,
                                currentDate,
                                startTime
                        );


                // =====================================
                // AGREGAR A LA LISTA GLOBAL
                // =====================================

                allSchedulesToCreate.addAll(
                        schedules
                );
            }


            // =========================================
            // SIGUIENTE FECHA
            // =========================================

            currentDate =
                    currentDate.plusDays(
                            1
                    );
        }


        // =============================================
        // VALIDAR QUE EXISTAN OCURRENCIAS
        // =============================================

        if (
                allSchedulesToCreate.isEmpty()
        ) {

            throw new ResourceConflictException(
                    "El rango seleccionado no contiene " +
                            "ningún día de la semana elegido."
            );
        }


        // =================================================
        // VALIDAR TODOS LOS CONFLICTOS
        // =================================================

        validarTodosLosConflictos(
                allSchedulesToCreate
        );


        // =================================================
        // SOLO AHORA SE GUARDA TODO
        // =================================================

        List<Schedule> savedSchedules =
                scheduleRepository.saveAll(
                        allSchedulesToCreate
                );


        // =================================================
        // CONVERTIR RESPUESTA
        // =================================================

        return savedSchedules
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


    // =================================================
    // VALIDAR TODOS LOS CONFLICTOS
    // =================================================

    private void validarTodosLosConflictos(
            List<Schedule> schedulesToCreate) {

        for (
                Schedule schedule :
                schedulesToCreate
        ) {

            List<Schedule> conflicts =
                    scheduleRepository
                            .findConflictingSchedules(
                                    schedule.getAirDate(),
                                    schedule.getStartTime(),
                                    schedule.getEndTime()
                            );


            if (
                    !conflicts.isEmpty()
            ) {

                throw new ResourceConflictException(
                        "No se puede repetir el bloque porque " +
                                "ya existe una programación para el día " +
                                schedule.getAirDate() +
                                " entre " +
                                schedule.getStartTime() +
                                " y " +
                                schedule.getEndTime() +
                                "."
                );
            }
        }
    }


    // =================================================
    // CONVERTIR A RESPONSE DTO
    // =================================================

    private ScheduleResponseDTO toResponseDTO(
            Schedule schedule) {

        ScheduleResponseDTO response =
                new ScheduleResponseDTO();


        // =============================================
        // INFORMACIÓN BÁSICA
        // =============================================

        response.setId(
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


        response.setActive(
                schedule.getActive()
        );


        // =============================================
        // FRAGMENTO
        // =============================================

        response.setContentStartOffset(
                schedule.getContentStartOffset()
        );


        response.setContentEndOffset(
                schedule.getContentEndOffset()
        );


        // =============================================
        // EPISODIO
        // =============================================

        if (
                schedule.getEpisode() != null
        ) {

            var episode =
                    schedule.getEpisode();


            response.setContentType(
                    "EPISODE"
            );


            response.setEpisodeId(
                    episode.getId()
            );


            response.setEpisodeNumber(
                    episode.getEpisodeNumber()
            );


            response.setEpisodeTitle(
                    episode.getTitle()
            );


            response.setVideoUrl(
                    episode.getVideoUrl()
            );


            if (
                    episode.getSeason() != null
            ) {

                response.setSeasonTitle(
                        episode
                                .getSeason()
                                .getTitle()
                );


                if (
                        episode
                                .getSeason()
                                .getSeries() != null
                ) {

                    response.setSeriesTitle(
                            episode
                                    .getSeason()
                                    .getSeries()
                                    .getTitle()
                    );
                }
            }


            return response;
        }


        // =============================================
        // MEDIA CONTENT
        // =============================================

        if (
                schedule.getMediaContent() != null
        ) {

            var mediaContent =
                    schedule.getMediaContent();


            response.setContentType(
                    "MEDIA_CONTENT"
            );


            response.setMediaContentId(
                    mediaContent.getId()
            );


            response.setMediaContentTitle(
                    mediaContent.getTitle()
            );


            response.setMediaContentDescription(
                    mediaContent.getDescription()
            );


            response.setMediaContentType(
                    mediaContent.getType()
            );


            response.setVideoUrl(
                    mediaContent.getVideoUrl()
            );
        }


        return response;
    }
}