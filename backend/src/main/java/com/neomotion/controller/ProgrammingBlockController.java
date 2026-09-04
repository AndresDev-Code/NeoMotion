package com.neomotion.controller;

import com.neomotion.dto.ProgrammingBlockGenerationRequestDTO;
import com.neomotion.dto.ProgrammingBlockRepeatPreviewResponseDTO;
import com.neomotion.dto.ProgrammingBlockRepeatRequestDTO;
import com.neomotion.dto.ProgrammingBlockRequestDTO;
import com.neomotion.dto.ProgrammingBlockResponseDTO;
import com.neomotion.dto.ScheduleResponseDTO;
import com.neomotion.service.ProgrammingBlockGenerationService;
import com.neomotion.service.ProgrammingBlockRepeatPreviewService;
import com.neomotion.service.ProgrammingBlockRepeatService;
import com.neomotion.service.ProgrammingBlockService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programming-blocks")
public class ProgrammingBlockController {

    // =================================================
    // SERVICIO PRINCIPAL DE BLOQUES
    // =================================================

    private final ProgrammingBlockService
            programmingBlockService;


    // =================================================
    // SERVICIO DE GENERACIÓN
    // =================================================

    private final ProgrammingBlockGenerationService
            programmingBlockGenerationService;


    // =================================================
    // SERVICIO DE REPETICIÓN
    // =================================================

    private final ProgrammingBlockRepeatService
            programmingBlockRepeatService;


    // =================================================
    // SERVICIO DE PREVISUALIZACIÓN
    // =================================================

    private final ProgrammingBlockRepeatPreviewService
            programmingBlockRepeatPreviewService;


    // =================================================
    // CONSTRUCTOR
    // =================================================

    public ProgrammingBlockController(
            ProgrammingBlockService programmingBlockService,
            ProgrammingBlockGenerationService
                    programmingBlockGenerationService,
            ProgrammingBlockRepeatService
                    programmingBlockRepeatService,
            ProgrammingBlockRepeatPreviewService
                    programmingBlockRepeatPreviewService) {

        this.programmingBlockService =
                programmingBlockService;

        this.programmingBlockGenerationService =
                programmingBlockGenerationService;

        this.programmingBlockRepeatService =
                programmingBlockRepeatService;

        this.programmingBlockRepeatPreviewService =
                programmingBlockRepeatPreviewService;
    }


    // =================================================
    // OBTENER TODOS LOS BLOQUES
    // =================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProgrammingBlockResponseDTO> findAll() {

        return programmingBlockService.findAll();
    }


    // =================================================
    // OBTENER BLOQUE POR ID
    // =================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProgrammingBlockResponseDTO findById(
            @PathVariable Long id) {

        return programmingBlockService.findById(
                id
        );
    }

    // =================================================
   // OBTENER PROGRAMACIÓN GENERADA POR EL BLOQUE
   // =================================================

    @GetMapping("/{id}/schedules")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ScheduleResponseDTO> findSchedules(
            @PathVariable Long id) {

        return programmingBlockService.findSchedules(
                id
        );
    }


    // =================================================
    // CREAR BLOQUE
    // =================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProgrammingBlockResponseDTO save(
            @Valid
            @RequestBody
            ProgrammingBlockRequestDTO request) {

        return programmingBlockService.save(
                request
        );
    }


    // =================================================
    // ACTUALIZAR BLOQUE
    // =================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProgrammingBlockResponseDTO update(
            @PathVariable Long id,

            @Valid
            @RequestBody
            ProgrammingBlockRequestDTO request) {

        return programmingBlockService.update(
                id,
                request
        );
    }


    // =================================================
    // ELIMINAR BLOQUE
    // =================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(
            @PathVariable Long id) {

        programmingBlockService.deleteById(
                id
        );
    }


    // =================================================
    // GENERAR UN BLOQUE
    // =================================================

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ScheduleResponseDTO> generate(
            @Valid
            @RequestBody
            ProgrammingBlockGenerationRequestDTO request) {

        return programmingBlockGenerationService.generate(
                request
        );
    }


    // =================================================
    // PREVISUALIZAR REPETICIÓN
    // =================================================

    @PostMapping("/repeat/preview")
    @PreAuthorize("hasRole('ADMIN')")
    public ProgrammingBlockRepeatPreviewResponseDTO
    previewRepeat(
            @Valid
            @RequestBody
            ProgrammingBlockRepeatRequestDTO request) {

        return programmingBlockRepeatPreviewService
                .preview(
                        request
                );
    }


    // =================================================
    // REPETIR BLOQUE EN UN RANGO
    // =================================================

    @PostMapping("/repeat")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ScheduleResponseDTO> repeat(
            @Valid
            @RequestBody
            ProgrammingBlockRepeatRequestDTO request) {

        return programmingBlockRepeatService.repeat(
                request
        );
    }
}