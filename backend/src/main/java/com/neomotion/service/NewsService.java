package com.neomotion.service;

import com.neomotion.dto.NewsRequestDTO;
import com.neomotion.dto.NewsResponseDTO;

import java.util.List;

public interface NewsService {

    List<NewsResponseDTO> findPublic();

    List<NewsResponseDTO> findAll();

    NewsResponseDTO findById(
            Long id
    );

    NewsResponseDTO save(
            NewsRequestDTO request
    );

    NewsResponseDTO update(
            Long id,
            NewsRequestDTO request
    );

    void deleteById(
            Long id
    );
}