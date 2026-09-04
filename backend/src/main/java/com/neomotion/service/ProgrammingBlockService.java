package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockRequestDTO;
import com.neomotion.dto.ProgrammingBlockResponseDTO;
import com.neomotion.dto.ScheduleResponseDTO;

import java.util.List;

public interface ProgrammingBlockService {

    // =================================================
    // CREAR
    // =================================================

    ProgrammingBlockResponseDTO save(
            ProgrammingBlockRequestDTO request
    );


    // =================================================
    // OBTENER TODOS
    // =================================================

    List<ProgrammingBlockResponseDTO> findAll();


    // =================================================
    // OBTENER POR ID
    // =================================================

    ProgrammingBlockResponseDTO findById(
            Long id
    );


    // =================================================
    // ACTUALIZAR
    // =================================================

    ProgrammingBlockResponseDTO update(
            Long id,
            ProgrammingBlockRequestDTO request
    );


    // =================================================
    // ELIMINAR
    // =================================================

    void deleteById(
            Long id
    );

    // =================================================
    // PROGRAMACIÓN GENERADA POR EL BLOQUE
   // =================================================

    List<ScheduleResponseDTO> findSchedules(
            Long id
    );
}
