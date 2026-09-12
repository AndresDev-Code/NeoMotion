package com.neomotion.service.storage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class StorageServiceImplTest {

    @TempDir
    Path tempDirectory;

    private StorageServiceImpl storageService;

    @BeforeEach
    void setUp() {
        storageService = new StorageServiceImpl();

        Path imagesDirectory = tempDirectory.resolve("images");
        Path videosDirectory = tempDirectory.resolve("videos");

        ReflectionTestUtils.setField(
                storageService,
                "imageFolder",
                imagesDirectory.toString()
        );

        ReflectionTestUtils.setField(
                storageService,
                "videoFolder",
                videosDirectory.toString()
        );
    }

    @Test
    void saveImageShouldCreateFileWithLowercaseExtension() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "poster.PNG",
                "image/png",
                "contenido de prueba".getBytes(StandardCharsets.UTF_8)
        );

        String filename = storageService.saveImage(file);

        assertNotNull(filename);
        assertTrue(filename.endsWith(".png"));

        Path savedFile =
                tempDirectory
                        .resolve("images")
                        .resolve(filename);

        assertTrue(Files.exists(savedFile));

        String content = Files.readString(savedFile);

        assertEquals("contenido de prueba", content);
    }

    @Test
    void deleteImageShouldDeleteExistingFile() throws Exception {

        Path imagesDirectory = tempDirectory.resolve("images");
        Files.createDirectories(imagesDirectory);

        Path file = imagesDirectory.resolve("poster.png");

        Files.writeString(
                file,
                "contenido de prueba",
                StandardCharsets.UTF_8
        );

        storageService.deleteImage("poster.png");

        assertFalse(Files.exists(file));
    }

    @Test
    void deleteImageShouldRejectPathTraversal() {

        assertThrows(
                SecurityException.class,
                () -> storageService.deleteImage("../poster.png")
        );
    }

}