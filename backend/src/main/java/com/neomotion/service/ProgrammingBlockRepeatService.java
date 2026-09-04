package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockRepeatRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;

import java.util.List;

public interface ProgrammingBlockRepeatService {

    List<ScheduleResponseDTO> repeat(
            ProgrammingBlockRepeatRequestDTO request
    );
}