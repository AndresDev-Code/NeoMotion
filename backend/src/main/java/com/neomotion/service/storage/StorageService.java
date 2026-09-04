package com.neomotion.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String saveImage(MultipartFile file);

    String saveVideo(MultipartFile file);

    void deleteImage(String filename);

    void deleteVideo(String filename);

}