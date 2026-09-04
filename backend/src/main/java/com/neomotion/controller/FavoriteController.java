package com.neomotion.controller;

import com.neomotion.dto.FavoriteResponseDTO;
import com.neomotion.service.FavoriteService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@PreAuthorize("isAuthenticated()")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(
            FavoriteService favoriteService) {

        this.favoriteService =
                favoriteService;
    }

    @PostMapping("/{seriesId}")
    public FavoriteResponseDTO add(
            @PathVariable Long seriesId) {

        return favoriteService.add(
                seriesId
        );
    }

    @DeleteMapping("/{seriesId}")
    public void remove(
            @PathVariable Long seriesId) {

        favoriteService.remove(
                seriesId
        );
    }

    @GetMapping
    public List<FavoriteResponseDTO> findMine() {

        return favoriteService.findMine();
    }

    @GetMapping("/{seriesId}/exists")
    public boolean exists(
            @PathVariable Long seriesId) {

        return favoriteService.exists(
                seriesId
        );
    }
}