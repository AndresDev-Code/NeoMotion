package com.neomotion.repository;

import com.neomotion.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    List<Favorite>
    findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    Optional<Favorite>
    findByUserIdAndSeriesId(
            Long userId,
            Long seriesId
    );

    boolean existsByUserIdAndSeriesId(
            Long userId,
            Long seriesId
    );

    void deleteByUserIdAndSeriesId(
            Long userId,
            Long seriesId
    );
}