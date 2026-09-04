package com.neomotion.controller;

import com.neomotion.dto.NewsRequestDTO;
import com.neomotion.dto.NewsResponseDTO;
import com.neomotion.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;


    public NewsController(
            NewsService newsService) {

        this.newsService =
                newsService;
    }


    // =================================================
    // NOTICIAS PÚBLICAS
    // =================================================

    @GetMapping
    public List<NewsResponseDTO> findPublic() {

        return newsService.findPublic();
    }


    // =================================================
    // TODAS — ADMIN
    // =================================================

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<NewsResponseDTO> findAll() {

        return newsService.findAll();
    }


    // =================================================
    // POR ID
    // =================================================

    @GetMapping("/{id}")
    public NewsResponseDTO findById(
            @PathVariable Long id) {

        return newsService.findById(id);
    }


    // =================================================
    // CREAR
    // =================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public NewsResponseDTO save(
            @Valid @RequestBody NewsRequestDTO request) {

        return newsService.save(
                request
        );
    }


    // =================================================
    // ACTUALIZAR
    // =================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public NewsResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody NewsRequestDTO request) {

        return newsService.update(
                id,
                request
        );
    }


    // =================================================
    // ELIMINAR
    // =================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(
            @PathVariable Long id) {

        newsService.deleteById(id);
    }
}