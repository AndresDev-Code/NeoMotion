package com.neomotion.service;

import com.neomotion.dto.SeasonRequestDTO;
import com.neomotion.dto.SeasonResponseDTO;

import java.util.List;
import java.util.Optional;

public interface SeasonService {

    SeasonResponseDTO save(SeasonRequestDTO request);

    List<SeasonResponseDTO> findAll();

    Optional<SeasonResponseDTO> findById(Long id);

    List<SeasonResponseDTO> findBySeries(Long seriesId);

    SeasonResponseDTO update(Long id, SeasonRequestDTO request);

    void deleteById(Long id);

}