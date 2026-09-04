package com.neomotion.controller;

import com.neomotion.dto.EpisodeRequestDTO;
import com.neomotion.dto.EpisodeResponseDTO;
import com.neomotion.service.EpisodeService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/episodes")
public class EpisodeController {

    private final EpisodeService episodeService;

    public EpisodeController(EpisodeService episodeService) {
        this.episodeService = episodeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EpisodeResponseDTO save(
            @Valid @RequestBody EpisodeRequestDTO request) {

        return episodeService.save(request);
    }

    @GetMapping
    public List<EpisodeResponseDTO> findAll() {

        return episodeService.findAll();
    }

    @GetMapping("/{id}")
    public EpisodeResponseDTO findById(
            @PathVariable Long id) {

        return episodeService.findById(id);
    }

    @GetMapping("/season/{seasonId}")
    public List<EpisodeResponseDTO> findBySeason(
            @PathVariable Long seasonId) {

        return episodeService.findBySeason(seasonId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EpisodeResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody EpisodeRequestDTO request) {

        return episodeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(
            @PathVariable Long id) {

        episodeService.deleteById(id);
    }
}