package com.neomotion.repository;

import com.neomotion.entity.Recommendation;
import com.neomotion.entity.RecommendationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository
        extends JpaRepository<Recommendation, Long> {

    List<Recommendation>
    findAllByOrderByCreatedAtDesc();

    List<Recommendation>
    findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<Recommendation>
    findByStatusOrderByCreatedAtDesc(
            RecommendationStatus status
    );
}