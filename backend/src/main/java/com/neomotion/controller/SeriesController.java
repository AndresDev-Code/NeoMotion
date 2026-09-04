package com.neomotion.controller;

import com.neomotion.dto.SeriesRequestDTO;
import com.neomotion.dto.SeriesResponseDTO;
import com.neomotion.service.SeriesService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/series")
public class SeriesController {

    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    // =========================
    // ADMINISTRACIÓN
    // =========================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SeriesResponseDTO save(
            @Valid @RequestBody SeriesRequestDTO request) {

        return seriesService.save(request);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SeriesResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody SeriesRequestDTO request) {

        return seriesService.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(
            @PathVariable Long id) {

        seriesService.deleteById(id);
    }


    // =========================
    // PÚBLICO
    // =========================

    @GetMapping
    public List<SeriesResponseDTO> findAll() {

        return seriesService.findAll();
    }


    @GetMapping("/{id}")
    public Optional<SeriesResponseDTO> findById(
            @PathVariable Long id) {

        return seriesService.findById(id);
    }


    @GetMapping("/title/{title}")
    public Optional<SeriesResponseDTO> findByTitle(
            @PathVariable String title) {

        return seriesService.findByTitle(title);
    }
}