package com.neomotion.service;

import com.neomotion.dto.FavoriteResponseDTO;

import java.util.List;

public interface FavoriteService {

    FavoriteResponseDTO add(
            Long seriesId
    );

    void remove(
            Long seriesId
    );

    List<FavoriteResponseDTO> findMine();

    boolean exists(
            Long seriesId
    );
}