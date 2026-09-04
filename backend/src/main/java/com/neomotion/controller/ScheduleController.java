package com.neomotion.controller;

import com.neomotion.dto.ScheduleRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;
import com.neomotion.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;


    public ScheduleController(
            ScheduleService scheduleService) {

        this.scheduleService =
                scheduleService;
    }


    // =================================================
    // PÚBLICO
    // =================================================


    // =============================================
    // OBTENER TODA LA PROGRAMACIÓN
    // =============================================

    @GetMapping
    public List<ScheduleResponseDTO> findAll() {

        return scheduleService.findAll();
    }


    // =============================================
    // PROGRAMACIÓN ACTUAL
    // =============================================

    @GetMapping("/current")
    public ScheduleResponseDTO findCurrent() {

        return scheduleService.findCurrent();
    }


    // =============================================
    // SIGUIENTE PROGRAMA
    // =============================================

    @GetMapping("/next")
    public ScheduleResponseDTO findNext() {

        return scheduleService.findNext();
    }


    // =============================================
    // OBTENER POR RANGO DE FECHAS
    // =============================================

    @GetMapping("/range")
    public List<ScheduleResponseDTO> findByDateRange(

            @RequestParam
            @DateTimeFormat(
                    iso =
                            DateTimeFormat.ISO.DATE
            )
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(
                    iso =
                            DateTimeFormat.ISO.DATE
            )
            LocalDate endDate
    ) {

        return scheduleService.findByDateRange(
                startDate,
                endDate
        );
    }


    // =============================================
    // OBTENER POR FECHA
    // =============================================

    @GetMapping("/date/{airDate}")
    public List<ScheduleResponseDTO> findByAirDate(

            @PathVariable
            LocalDate airDate) {

        return scheduleService.findByAirDate(
                airDate
        );
    }


    // =============================================
    // PROGRAMACIÓN DE HOY
    // =============================================

    @GetMapping("/today")
    public List<ScheduleResponseDTO> findToday() {

        return scheduleService.findByAirDate(
                LocalDate.now()
        );
    }


    // =============================================
    // BUSCAR POR EPISODIO
    // =============================================

    @GetMapping("/episode/{episodeId}")
    public List<ScheduleResponseDTO> findByEpisode(

            @PathVariable
            Long episodeId) {

        return scheduleService.findByEpisode(
                episodeId
        );
    }


    // =============================================
    // BUSCAR POR MEDIA CONTENT
    // =============================================

    @GetMapping("/media-content/{mediaContentId}")
    public List<ScheduleResponseDTO> findByMediaContent(

            @PathVariable
            Long mediaContentId) {

        return scheduleService.findByMediaContent(
                mediaContentId
        );
    }


    // =============================================
    // OBTENER POR ID
    // =============================================

    @GetMapping("/{id}")
    public ScheduleResponseDTO findById(

            @PathVariable
            Long id) {

        return scheduleService.findById(
                id
        );
    }


    // =================================================
    // ADMINISTRACIÓN
    // =================================================


    // =============================================
    // CREAR PROGRAMACIÓN
    // =============================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ScheduleResponseDTO save(

            @Valid
            @RequestBody
            ScheduleRequestDTO request) {

        return scheduleService.save(
                request
        );
    }


    // =============================================
    // CREAR SIGUIENTE PROGRAMACIÓN
    // =============================================

    @PostMapping("/next")
    @PreAuthorize("hasRole('ADMIN')")
    public ScheduleResponseDTO saveNext(

            @Valid
            @RequestBody
            ScheduleRequestDTO request) {

        return scheduleService.saveNext(
                request
        );
    }


    // =============================================
    // ACTUALIZAR PROGRAMACIÓN
    // =============================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ScheduleResponseDTO update(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            ScheduleRequestDTO request) {

        return scheduleService.update(
                id,
                request
        );
    }


    // =============================================
    // ELIMINAR PROGRAMACIÓN
    // =============================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(

            @PathVariable
            Long id) {

        scheduleService.deleteById(
                id
        );
    }
}