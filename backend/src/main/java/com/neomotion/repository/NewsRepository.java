package com.neomotion.repository;

import com.neomotion.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository
        extends JpaRepository<News, Long> {

    List<News>
    findByActiveTrueOrderByPublishedAtDesc();

    List<News>
    findAllByOrderByPublishedAtDesc();
}
