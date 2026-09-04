package com.neomotion.service;

import com.neomotion.dto.SeriesRequestDTO;
import com.neomotion.dto.SeriesResponseDTO;

import java.util.List;
import java.util.Optional;

public interface SeriesService {

    SeriesResponseDTO save(SeriesRequestDTO request);

    List<SeriesResponseDTO> findAll();

    Optional<SeriesResponseDTO> findById(Long id);

    Optional<SeriesResponseDTO> findByTitle(String title);

    SeriesResponseDTO update(Long id, SeriesRequestDTO request);

    void deleteById(Long id);

}
