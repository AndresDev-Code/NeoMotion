package com.neomotion.service;

import com.neomotion.dto.MediaContentRequestDTO;
import com.neomotion.dto.MediaContentResponseDTO;
import com.neomotion.entity.MediaContent;
import com.neomotion.entity.MediaContentType;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.MediaContentRepository;
import org.springframework.stereotype.Service;
import com.neomotion.service.storage.StorageService;
import org.springframework.web.multipart.MultipartFile;
import com.neomotion.repository.ScheduleRepository;

import java.nio.file.Paths;
import java.util.List;

@Service
public class MediaContentServiceImpl implements MediaContentService {

    private final MediaContentRepository mediaContentRepository;
    private final StorageService storageService;
    private final ScheduleRepository scheduleRepository;

    public MediaContentServiceImpl(
            MediaContentRepository mediaContentRepository,
            StorageService storageService,
            ScheduleRepository scheduleRepository) {

        this.mediaContentRepository = mediaContentRepository;
        this.storageService = storageService;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public MediaContentResponseDTO save(
            MediaContentRequestDTO request) {

        MediaContent mediaContent = new MediaContent();

        mediaContent.setTitle(request.getTitle());
        mediaContent.setDescription(request.getDescription());
        mediaContent.setType(request.getType());
        mediaContent.setDurationSeconds(
                request.getDurationSeconds()
        );
        mediaContent.setThumbnail(request.getThumbnail());
        mediaContent.setVideoUrl(request.getVideoUrl());

        mediaContent.setActive(true);

        MediaContent saved =
                mediaContentRepository.save(mediaContent);

        return toResponseDTO(saved);
    }

    @Override
    public MediaContentResponseDTO saveWithFiles(
            MediaContentRequestDTO request,
            MultipartFile thumbnail,
            MultipartFile video) {

        String thumbnailFilename =
                storageService.saveImage(thumbnail);

        String videoFilename =
                storageService.saveVideo(video);

        MediaContent mediaContent = new MediaContent();

        mediaContent.setTitle(request.getTitle());
        mediaContent.setDescription(request.getDescription());
        mediaContent.setType(request.getType());
        mediaContent.setDurationSeconds(
                request.getDurationSeconds()
        );

        mediaContent.setThumbnail(
                "/uploads/images/" + thumbnailFilename
        );

        mediaContent.setVideoUrl(
                "/uploads/videos/" + videoFilename
        );

        mediaContent.setActive(true);

        MediaContent saved =
                mediaContentRepository.save(mediaContent);

        return toResponseDTO(saved);
    }


    @Override
    public List<MediaContentResponseDTO> findAll() {

        return mediaContentRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    @Override
    public MediaContentResponseDTO findById(Long id) {

        MediaContent mediaContent =
                mediaContentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contenido multimedia no encontrado."
                                )
                        );

        return toResponseDTO(mediaContent);
    }


    @Override
    public List<MediaContentResponseDTO> findByType(
            MediaContentType type) {

        return mediaContentRepository.findByType(type)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    @Override
    public List<MediaContentResponseDTO> findActive() {

        return mediaContentRepository.findByActiveTrue()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    @Override
    public List<MediaContentResponseDTO> findActiveByType(
            MediaContentType type) {

        return mediaContentRepository
                .findByTypeAndActiveTrue(type)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    @Override
    public MediaContentResponseDTO update(
            Long id,
            MediaContentRequestDTO request) {

        MediaContent mediaContent =
                mediaContentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contenido multimedia no encontrado."
                                )
                        );

        mediaContent.setTitle(request.getTitle());
        mediaContent.setDescription(request.getDescription());
        mediaContent.setType(request.getType());
        mediaContent.setDurationSeconds(
                request.getDurationSeconds()
        );
        mediaContent.setThumbnail(request.getThumbnail());
        mediaContent.setVideoUrl(request.getVideoUrl());

        MediaContent updated =
                mediaContentRepository.save(mediaContent);

        return toResponseDTO(updated);
    }

    @Override
    public MediaContentResponseDTO updateWithFiles(
            Long id,
            MediaContentRequestDTO request,
            MultipartFile thumbnail,
            MultipartFile video) {

        MediaContent mediaContent =
                mediaContentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contenido multimedia no encontrado."
                                )
                        );


        // =========================
        // ACTUALIZAR DATOS
        // =========================

        mediaContent.setTitle(
                request.getTitle()
        );

        mediaContent.setDescription(
                request.getDescription()
        );

        mediaContent.setType(
                request.getType()
        );

        mediaContent.setDurationSeconds(
                request.getDurationSeconds()
        );


        // =========================
        // REEMPLAZAR THUMBNAIL
        // =========================

        if (thumbnail != null &&
                !thumbnail.isEmpty()) {

            if (mediaContent.getThumbnail() != null &&
                    !mediaContent.getThumbnail().isBlank()) {

                String oldThumbnailFilename =
                        Paths.get(
                                mediaContent.getThumbnail()
                        ).getFileName().toString();

                storageService.deleteImage(
                        oldThumbnailFilename
                );
            }


            String newThumbnailFilename =
                    storageService.saveImage(thumbnail);


            mediaContent.setThumbnail(
                    "/uploads/images/" +
                            newThumbnailFilename
            );
        }


        // =========================
        // REEMPLAZAR VIDEO
        // =========================

        if (video != null &&
                !video.isEmpty()) {

            if (mediaContent.getVideoUrl() != null &&
                    !mediaContent.getVideoUrl().isBlank()) {

                String oldVideoFilename =
                        Paths.get(
                                mediaContent.getVideoUrl()
                        ).getFileName().toString();

                storageService.deleteVideo(
                        oldVideoFilename
                );
            }


            String newVideoFilename =
                    storageService.saveVideo(video);


            mediaContent.setVideoUrl(
                    "/uploads/videos/" +
                            newVideoFilename
            );
        }


        // =========================
        // GUARDAR CAMBIOS
        // =========================

        MediaContent updated =
                mediaContentRepository.save(
                        mediaContent
                );


        return toResponseDTO(updated);
    }





    @Override
    public void deleteById(Long id) {

        MediaContent mediaContent =
                mediaContentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contenido multimedia no encontrado."
                                )
                        );


        // =========================
        // VERIFICAR PROGRAMACIÓN
        // =========================

        if (scheduleRepository.existsByMediaContentId(id)) {

            throw new IllegalStateException(
                    "No se puede eliminar este contenido multimedia porque está siendo utilizado en una programación."
            );
        }


        // =========================
        // ELIMINAR THUMBNAIL
        // =========================

        if (mediaContent.getThumbnail() != null &&
                !mediaContent.getThumbnail().isBlank()) {

            String thumbnailFilename =
                    Paths.get(
                            mediaContent.getThumbnail()
                    ).getFileName().toString();

            storageService.deleteImage(
                    thumbnailFilename
            );
        }


        // =========================
        // ELIMINAR VIDEO
        // =========================

        if (mediaContent.getVideoUrl() != null &&
                !mediaContent.getVideoUrl().isBlank()) {

            String videoFilename =
                    Paths.get(
                            mediaContent.getVideoUrl()
                    ).getFileName().toString();

            storageService.deleteVideo(
                    videoFilename
            );
        }


        // =========================
        // ELIMINAR REGISTRO
        // =========================

        mediaContentRepository.delete(
                mediaContent
        );
    }


    private MediaContentResponseDTO toResponseDTO(
            MediaContent mediaContent) {

        MediaContentResponseDTO response =
                new MediaContentResponseDTO();

        response.setId(mediaContent.getId());
        response.setTitle(mediaContent.getTitle());
        response.setDescription(
                mediaContent.getDescription()
        );
        response.setType(mediaContent.getType());
        response.setDurationSeconds(
                mediaContent.getDurationSeconds()
        );
        response.setThumbnail(
                mediaContent.getThumbnail()
        );
        response.setVideoUrl(
                mediaContent.getVideoUrl()
        );
        response.setActive(
                mediaContent.getActive()
        );
        response.setCreatedAt(
                mediaContent.getCreatedAt()
        );
        response.setUpdatedAt(
                mediaContent.getUpdatedAt()
        );

        return response;
    }
}