package com.neomotion.service;

import com.neomotion.dto.MediaContentRequestDTO;
import com.neomotion.dto.MediaContentResponseDTO;
import com.neomotion.entity.MediaContentType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MediaContentService {

    MediaContentResponseDTO save(
            MediaContentRequestDTO request
    );

    MediaContentResponseDTO saveWithFiles(
            MediaContentRequestDTO request,
            MultipartFile thumbnail,
            MultipartFile video
    );

    List<MediaContentResponseDTO> findAll();

    MediaContentResponseDTO findById(Long id);

    List<MediaContentResponseDTO> findByType(
            MediaContentType type
    );

    List<MediaContentResponseDTO> findActive();

    List<MediaContentResponseDTO> findActiveByType(
            MediaContentType type
    );

    MediaContentResponseDTO update(
            Long id,
            MediaContentRequestDTO request
    );

    MediaContentResponseDTO updateWithFiles(
            Long id,
            MediaContentRequestDTO request,
            MultipartFile thumbnail,
            MultipartFile video
    );

    void deleteById(Long id);
}