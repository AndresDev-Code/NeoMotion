package com.neomotion.repository;

import com.neomotion.entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeasonRepository extends JpaRepository<Season, Long> {

    Optional<Season> findBySeriesIdAndSeasonNumber(Long seriesId, Integer seasonNumber);

    List<Season> findBySeriesId(Long seriesId);

}