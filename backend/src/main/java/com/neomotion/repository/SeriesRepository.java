package com.neomotion.repository;

import com.neomotion.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeriesRepository extends JpaRepository<Series, Long> {

    Optional<Series> findByTitle(String title);

    boolean existsByTitle(String title);

    List<Series> findAllByOrderByIdAsc();

}