package com.neomotion.controller;

import com.neomotion.dto.SeasonRequestDTO;
import com.neomotion.dto.SeasonResponseDTO;
import com.neomotion.service.SeasonService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seasons")
public class SeasonController {

    private final SeasonService seasonService;

    public SeasonController(SeasonService seasonService) {
        this.seasonService = seasonService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public SeasonResponseDTO save(
            @Valid @RequestBody SeasonRequestDTO request) {

        return seasonService.save(request);
    }


    @GetMapping
    public List<SeasonResponseDTO> findAll() {

        return seasonService.findAll();
    }


    @GetMapping("/{id}")
    public Optional<SeasonResponseDTO> findById(
            @PathVariable Long id) {

        return seasonService.findById(id);
    }


    @GetMapping("/series/{seriesId}")
    public List<SeasonResponseDTO> findBySeries(
            @PathVariable Long seriesId) {

        return seasonService.findBySeries(seriesId);
    }


    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public SeasonResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody SeasonRequestDTO request) {

        return seasonService.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteById(
            @PathVariable Long id) {

        seasonService.deleteById(id);
    }
}