package com.neomotion.repository;

import com.neomotion.entity.MediaContent;
import com.neomotion.entity.MediaContentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaContentRepository
        extends JpaRepository<MediaContent, Long> {

    List<MediaContent> findByType(MediaContentType type);

    List<MediaContent> findByActiveTrue();

    List<MediaContent> findByTypeAndActiveTrue(MediaContentType type);
}