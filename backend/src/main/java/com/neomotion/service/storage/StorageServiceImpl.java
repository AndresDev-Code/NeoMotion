package com.neomotion.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
public class StorageServiceImpl implements StorageService {

    @Value("${storage.images}")
    private String imageFolder;

    @Value("${storage.videos}")
    private String videoFolder;

    @Override
    public String saveImage(MultipartFile file) {
        return save(file, imageFolder);
    }

    @Override
    public String saveVideo(MultipartFile file) {
        return save(file, videoFolder);
    }

    @Override
    public void deleteImage(String filename) {
        delete(filename, imageFolder);
    }

    @Override
    public void deleteVideo(String filename) {
        delete(filename, videoFolder);
    }

    private void delete(String filename, String folder) {

        try {

            Path baseDirectory =
                    Paths.get(folder)
                            .toAbsolutePath()
                            .normalize();

            Path file =
                    baseDirectory
                            .resolve(filename)
                            .normalize();

            if (!file.startsWith(baseDirectory)) {
                throw new SecurityException(
                        "Ruta de archivo no permitida."
                );
            }

            Files.deleteIfExists(file);

        } catch (IOException e) {

            throw new RuntimeException(
                    "No fue posible eliminar el archivo."
            );
        }
    }

    private String save(
            MultipartFile file,
            String folder) {

        try {

            Path baseDirectory =
                    Paths.get(folder)
                            .toAbsolutePath()
                            .normalize();

            Files.createDirectories(baseDirectory);

            String originalName =
                    file.getOriginalFilename();

            String extension = "";

            if (originalName != null) {

                String cleanName =
                        Paths.get(originalName)
                                .getFileName()
                                .toString();

                int lastDot =
                        cleanName.lastIndexOf('.');

                if (
                        lastDot > 0 &&
                                lastDot < cleanName.length() - 1
                ) {

                    String candidate =
                            cleanName
                                    .substring(lastDot)
                                    .toLowerCase(
                                            Locale.ROOT
                                    );

                    if (
                            candidate.matches(
                                    "\\.[a-z0-9]{1,10}"
                            )
                    ) {
                        extension = candidate;
                    }
                }
            }

            String filename =
                    UUID.randomUUID() + extension;

            Path destination =
                    baseDirectory
                            .resolve(filename)
                            .normalize();

            if (!destination.startsWith(baseDirectory)) {
                throw new SecurityException(
                        "Ruta de archivo no permitida."
                );
            }

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return filename;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Error guardando el archivo."
            );
        }
    }
}