package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockRepeatPreviewResponseDTO;
import com.neomotion.dto.ProgrammingBlockRepeatRequestDTO;

public interface ProgrammingBlockRepeatPreviewService {

    ProgrammingBlockRepeatPreviewResponseDTO preview(
            ProgrammingBlockRepeatRequestDTO request
    );
}