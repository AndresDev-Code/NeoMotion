package com.neomotion.controller;

import com.neomotion.service.storage.StorageService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(
            value = "/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> uploadImage(
            @RequestParam("file") MultipartFile file) {

        String filename = storageService.saveImage(file);

        return Map.of(
                "filename", filename,
                "url", "/uploads/images/" + filename
        );
    }


    @PostMapping(
            value = "/video",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> uploadVideo(
            @RequestParam("file") MultipartFile file) {

        String filename = storageService.saveVideo(file);

        return Map.of(
                "filename", filename,
                "url", "/uploads/videos/" + filename
        );
    }

    @DeleteMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public void deleteImage(
            @RequestParam String filename) {

        storageService.deleteImage(filename);
    }

    @DeleteMapping("/video")
    @PreAuthorize("isAuthenticated()")
    public void deleteVideo(
            @RequestParam String filename) {

        storageService.deleteVideo(filename);
    }
}