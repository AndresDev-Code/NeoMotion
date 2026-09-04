package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockGenerationRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;
import com.neomotion.entity.ProgrammingBlock;
import com.neomotion.entity.Schedule;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.ProgrammingBlockRepository;
import com.neomotion.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ProgrammingBlockGenerationServiceImpl
        implements ProgrammingBlockGenerationService {

    private final ProgrammingBlockRepository
            programmingBlockRepository;

    private final ScheduleRepository
            scheduleRepository;

    private final ProgrammingBlockScheduleBuilder
            programmingBlockScheduleBuilder;


    public ProgrammingBlockGenerationServiceImpl(
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
    // GENERAR BLOQUE
    // =================================================

    @Override
    @Transactional
    public List<ScheduleResponseDTO> generate(
            ProgrammingBlockGenerationRequestDTO request) {

        // =============================================
        // VALIDAR REQUEST
        // =============================================

        if (request == null) {

            throw new ResourceConflictException(
                    "La solicitud de generación es obligatoria."
            );
        }


        LocalDate airDate =
                request.getAirDate();


        LocalTime startTime =
                request.getStartTime();


        if (airDate == null) {

            throw new ResourceConflictException(
                    "La fecha de transmisión es obligatoria."
            );
        }


        if (startTime == null) {

            throw new ResourceConflictException(
                    "La hora de inicio es obligatoria."
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
                    "No se puede generar un bloque inactivo."
            );
        }


        // =============================================
        // CONSTRUIR SCHEDULES
        // =============================================

        List<Schedule> schedulesToCreate =
                programmingBlockScheduleBuilder.build(
                        block,
                        airDate,
                        startTime
                );


        // =============================================
        // VALIDAR CONFLICTOS
        // =============================================

        validarConflictos(
                airDate,
                schedulesToCreate
        );


        // =============================================
        // GUARDAR TODO
        // =============================================

        List<Schedule> savedSchedules =
                scheduleRepository.saveAll(
                        schedulesToCreate
                );


        // =============================================
        // CONVERTIR RESPUESTA
        // =============================================

        return savedSchedules
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


    // =================================================
    // VALIDAR CONFLICTOS
    // =================================================

    private void validarConflictos(
            LocalDate airDate,
            List<Schedule> schedulesToCreate) {

        for (
                Schedule schedule :
                schedulesToCreate
        ) {

            List<Schedule> conflicts =
                    scheduleRepository
                            .findConflictingSchedules(
                                    airDate,
                                    schedule.getStartTime(),
                                    schedule.getEndTime()
                            );


            if (
                    !conflicts.isEmpty()
            ) {

                throw new ResourceConflictException(
                        "No se puede generar el bloque porque " +
                                "existe una programación que se cruza " +
                                "con el horario " +
                                schedule.getStartTime() +
                                " — " +
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