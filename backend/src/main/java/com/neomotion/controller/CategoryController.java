package com.neomotion.controller;

import com.neomotion.dto.CategoryRequestDTO;
import com.neomotion.dto.CategoryResponseDTO;
import com.neomotion.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public CategoryResponseDTO save(
            @Valid @RequestBody CategoryRequestDTO request) {

        return categoryService.save(request);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<CategoryResponseDTO> findAll() {

        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Optional<CategoryResponseDTO> findById(@PathVariable Long id) {

        return categoryService.findById(id);
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("isAuthenticated()")
    public Optional<CategoryResponseDTO> findByName(@PathVariable String name) {

        return categoryService.findByName(name);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public CategoryResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO request) {

        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteById(@PathVariable Long id) {

        categoryService.deleteById(id);
    }
}