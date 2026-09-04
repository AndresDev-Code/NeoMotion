package com.neomotion.controller;

import com.neomotion.dto.RecommendationRequestDTO;
import com.neomotion.dto.RecommendationResponseDTO;
import com.neomotion.dto.RecommendationStatusRequestDTO;
import com.neomotion.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService
            recommendationService;


    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService =
                recommendationService;
    }


    // =================================================
    // CREAR RECOMENDACIÓN
    // =================================================

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public RecommendationResponseDTO create(
            @Valid
            @RequestBody
            RecommendationRequestDTO request) {

        return recommendationService.create(
                request
        );
    }


    // =================================================
    // MIS RECOMENDACIONES
    // =================================================

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public List<RecommendationResponseDTO> findMine() {

        return recommendationService.findMine();
    }


    // =================================================
    // TODAS — ADMIN
    // =================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<RecommendationResponseDTO> findAll() {

        return recommendationService.findAll();
    }


    // =================================================
    // POR ID — ADMIN
    // =================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public RecommendationResponseDTO findById(
            @PathVariable Long id) {

        return recommendationService.findById(
                id
        );
    }


    // =================================================
    // CAMBIAR ESTADO — ADMIN
    // =================================================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public RecommendationResponseDTO updateStatus(
            @PathVariable Long id,

            @Valid
            @RequestBody
            RecommendationStatusRequestDTO request) {

        return recommendationService.updateStatus(
                id,
                request
        );
    }


    // =================================================
    // ELIMINAR — ADMIN
    // =================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(
            @PathVariable Long id) {

        recommendationService.deleteById(
                id
        );
    }

    // =================================================
   // ELIMINAR MI RECOMENDACIÓN — USUARIO
   // =================================================

    @DeleteMapping("/mine/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteMine(
            @PathVariable Long id) {

        recommendationService.deleteMine(
                id
        );
    }
}