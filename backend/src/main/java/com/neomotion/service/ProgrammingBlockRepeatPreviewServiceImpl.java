package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockRepeatPreviewItemDTO;
import com.neomotion.dto.ProgrammingBlockRepeatPreviewResponseDTO;
import com.neomotion.dto.ProgrammingBlockRepeatRequestDTO;
import com.neomotion.entity.ProgrammingBlock;
import com.neomotion.entity.Schedule;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.ProgrammingBlockRepository;
import com.neomotion.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProgrammingBlockRepeatPreviewServiceImpl
        implements ProgrammingBlockRepeatPreviewService {

    private final ProgrammingBlockRepository
            programmingBlockRepository;

    private final ScheduleRepository
            scheduleRepository;

    private final ProgrammingBlockScheduleBuilder
            programmingBlockScheduleBuilder;


    public ProgrammingBlockRepeatPreviewServiceImpl(
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
    // PREVISUALIZAR REPETICIÓN
    // =================================================

    @Override
    public ProgrammingBlockRepeatPreviewResponseDTO preview(
            ProgrammingBlockRepeatRequestDTO request) {

        // =============================================
        // VALIDAR REQUEST
        // =============================================

        if (request == null) {

            throw new ResourceConflictException(
                    "La solicitud de previsualización es obligatoria."
            );
        }


        if (request.getBlockId() == null) {

            throw new ResourceConflictException(
                    "El bloque de programación es obligatorio."
            );
        }


        if (request.getStartDate() == null) {

            throw new ResourceConflictException(
                    "La fecha inicial es obligatoria."
            );
        }


        if (request.getEndDate() == null) {

            throw new ResourceConflictException(
                    "La fecha final es obligatoria."
            );
        }


        if (
                request.getEndDate()
                        .isBefore(
                                request.getStartDate()
                        )
        ) {

            throw new ResourceConflictException(
                    "La fecha final no puede ser anterior " +
                            "a la fecha inicial."
            );
        }


        if (request.getStartTime() == null) {

            throw new ResourceConflictException(
                    "La hora de inicio es obligatoria."
            );
        }


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
                    "No se puede previsualizar un bloque inactivo."
            );
        }


        // =============================================
        // PREPARAR RESULTADO
        // =============================================

        List<ProgrammingBlockRepeatPreviewItemDTO>
                occurrences =
                new ArrayList<>();


        int totalOccurrences =
                0;


        int totalSchedules =
                0;


        int totalDurationSeconds =
                0;


        boolean hasConflicts =
                false;


        // =============================================
        // RECORRER FECHAS
        // =============================================

        LocalDate currentDate =
                request.getStartDate();


        while (
                !currentDate.isAfter(
                        request.getEndDate()
                )
        ) {

            // =========================================
            // ¿DÍA SELECCIONADO?
            // =========================================

            if (
                    daysOfWeek.contains(
                            currentDate.getDayOfWeek()
                    )
            ) {

                // =====================================
                // CONSTRUIR BLOQUE
                // =====================================

                List<Schedule> schedules =
                        programmingBlockScheduleBuilder.build(
                                block,
                                currentDate,
                                request.getStartTime()
                        );


                // =====================================
                // RESUMEN DE LA OCURRENCIA
                // =====================================

                ProgrammingBlockRepeatPreviewItemDTO
                        occurrence =
                        new ProgrammingBlockRepeatPreviewItemDTO();


                occurrence.setAirDate(
                        currentDate
                );


                occurrence.setStartTime(
                        request.getStartTime()
                );


                LocalTime endTime =
                        schedules
                                .get(
                                        schedules.size() - 1
                                )
                                .getEndTime();


                occurrence.setEndTime(
                        endTime
                );


                occurrence.setScheduleCount(
                        schedules.size()
                );


                // =====================================
                // DURACIÓN
                // =====================================

                long durationSeconds =
                        Duration
                                .between(
                                        request.getStartTime(),
                                        endTime
                                )
                                .getSeconds();


                totalDurationSeconds +=
                        (int) durationSeconds;


                // =====================================
                // BUSCAR CONFLICTOS
                // =====================================

                List<String> conflictMessages =
                        new ArrayList<>();


                for (
                        Schedule schedule :
                        schedules
                ) {

                    List<Schedule> conflicts =
                            scheduleRepository
                                    .findConflictingSchedules(
                                            currentDate,
                                            schedule.getStartTime(),
                                            schedule.getEndTime()
                                    );


                    if (
                            !conflicts.isEmpty()
                    ) {

                        String message =
                                "Existe programación entre " +
                                        schedule.getStartTime() +
                                        " y " +
                                        schedule.getEndTime();


                        conflictMessages.add(
                                message
                        );
                    }
                }


                // =====================================
                // ESTADO DEL CONFLICTO
                // =====================================

                boolean occurrenceHasConflict =
                        !conflictMessages.isEmpty();


                occurrence.setConflict(
                        occurrenceHasConflict
                );


                occurrence.setConflictMessages(
                        conflictMessages
                );


                if (
                        occurrenceHasConflict
                ) {

                    hasConflicts =
                            true;
                }


                // =====================================
                // CONTADORES
                // =====================================

                totalOccurrences++;

                totalSchedules +=
                        schedules.size();


                occurrences.add(
                        occurrence
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
        // VALIDAR RESULTADO
        // =============================================

        if (
                occurrences.isEmpty()
        ) {

            throw new ResourceConflictException(
                    "El rango seleccionado no contiene " +
                            "ningún día de la semana elegido."
            );
        }


        // =============================================
        // CREAR RESPONSE
        // =============================================

        ProgrammingBlockRepeatPreviewResponseDTO
                response =
                new ProgrammingBlockRepeatPreviewResponseDTO();


        response.setBlockId(
                block.getId()
        );


        response.setBlockName(
                block.getName()
        );


        response.setStartDate(
                request.getStartDate()
        );


        response.setEndDate(
                request.getEndDate()
        );


        response.setStartTime(
                request.getStartTime()
        );


        response.setTotalOccurrences(
                totalOccurrences
        );


        response.setTotalSchedules(
                totalSchedules
        );


        response.setTotalDurationSeconds(
                totalDurationSeconds
        );


        response.setHasConflicts(
                hasConflicts
        );


        response.setOccurrences(
                occurrences
        );


        return response;
    }
}