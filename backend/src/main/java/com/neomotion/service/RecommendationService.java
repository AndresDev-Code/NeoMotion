package com.neomotion.service;

import com.neomotion.dto.RecommendationRequestDTO;
import com.neomotion.dto.RecommendationResponseDTO;
import com.neomotion.dto.RecommendationStatusRequestDTO;

import java.util.List;

public interface RecommendationService {

    RecommendationResponseDTO create(
            RecommendationRequestDTO request
    );

    List<RecommendationResponseDTO> findMine();

    List<RecommendationResponseDTO> findAll();

    RecommendationResponseDTO findById(
            Long id
    );

    RecommendationResponseDTO updateStatus(
            Long id,
            RecommendationStatusRequestDTO request
    );

    void deleteById(
            Long id
    );

    void deleteMine(
            Long id
    );
}