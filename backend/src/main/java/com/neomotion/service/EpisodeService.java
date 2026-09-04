package com.neomotion.service;

import com.neomotion.dto.EpisodeRequestDTO;
import com.neomotion.dto.EpisodeResponseDTO;

import java.util.List;

public interface EpisodeService {

    EpisodeResponseDTO save(EpisodeRequestDTO request);

    List<EpisodeResponseDTO> findAll();

    EpisodeResponseDTO findById(Long id);

    List<EpisodeResponseDTO> findBySeason(Long seasonId);

    EpisodeResponseDTO update(Long id, EpisodeRequestDTO request);

    void deleteById(Long id);

}