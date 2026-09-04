package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockGenerationRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;

import java.util.List;

public interface ProgrammingBlockGenerationService {

    // =================================================
    // GENERAR UN BLOQUE
    // =================================================

    List<ScheduleResponseDTO> generate(
            ProgrammingBlockGenerationRequestDTO request
    );
}