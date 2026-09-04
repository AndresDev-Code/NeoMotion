package com.neomotion.controller;

import tools.jackson.databind.ObjectMapper;
import com.neomotion.dto.MediaContentRequestDTO;
import com.neomotion.dto.MediaContentResponseDTO;
import com.neomotion.entity.MediaContentType;
import com.neomotion.service.MediaContentService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media-content")
public class MediaContentController {

    private final MediaContentService mediaContentService;
    private final ObjectMapper objectMapper;

    public MediaContentController(
            MediaContentService mediaContentService,
            ObjectMapper objectMapper) {

        this.mediaContentService = mediaContentService;
        this.objectMapper = objectMapper;
    }


    // =========================
    // CREAR CON ARCHIVOS
    // =========================

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public MediaContentResponseDTO save(

            @RequestPart("data")
            String data,

            @RequestPart("thumbnail")
            MultipartFile thumbnail,

            @RequestPart("video")
            MultipartFile video

    ) throws IOException {

        MediaContentRequestDTO request =
                objectMapper.readValue(
                        data,
                        MediaContentRequestDTO.class
                );

        return mediaContentService.saveWithFiles(
                request,
                thumbnail,
                video
        );
    }


    // =========================
    // OBTENER TODOS
    // =========================

    @GetMapping
    public List<MediaContentResponseDTO> findAll() {

        return mediaContentService.findAll();
    }


    // =========================
    // OBTENER POR ID
    // =========================

    @GetMapping("/{id}")
    public MediaContentResponseDTO findById(
            @PathVariable Long id) {

        return mediaContentService.findById(id);
    }


    // =========================
    // OBTENER POR TIPO
    // =========================

    @GetMapping("/type/{type}")
    public List<MediaContentResponseDTO> findByType(
            @PathVariable MediaContentType type) {

        return mediaContentService.findByType(type);
    }


    // =========================
    // CONTENIDO ACTIVO
    // =========================

    @GetMapping("/active")
    public List<MediaContentResponseDTO> findActive() {

        return mediaContentService.findActive();
    }


    // =========================
    // ACTIVO POR TIPO
    // =========================

    @GetMapping("/active/type/{type}")
    public List<MediaContentResponseDTO> findActiveByType(
            @PathVariable MediaContentType type) {

        return mediaContentService.findActiveByType(type);
    }


    // =========================
// ACTUALIZAR DATOS
// =========================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MediaContentResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody MediaContentRequestDTO request) {

        return mediaContentService.update(
                id,
                request
        );
    }


// =========================
// ACTUALIZAR CON ARCHIVOS
// =========================

    @PutMapping(
            value = "/{id}/files",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public MediaContentResponseDTO updateWithFiles(

            @PathVariable Long id,

            @RequestPart("data")
            String data,

            @RequestPart(value = "thumbnail", required = false)
            MultipartFile thumbnail,

            @RequestPart(value = "video", required = false)
            MultipartFile video

    ) throws IOException {

        MediaContentRequestDTO request =
                objectMapper.readValue(
                        data,
                        MediaContentRequestDTO.class
                );

        return mediaContentService.updateWithFiles(
                id,
                request,
                thumbnail,
                video
        );
    }


// =========================
// ELIMINAR
// =========================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(
            @PathVariable Long id) {

        mediaContentService.deleteById(id);
    }
}