package com.neomotion.service;

import com.neomotion.dto.CategoryRequestDTO;
import com.neomotion.dto.CategoryResponseDTO;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    CategoryResponseDTO save(CategoryRequestDTO request);

    List<CategoryResponseDTO> findAll();

    Optional<CategoryResponseDTO> findById(Long id);

    Optional<CategoryResponseDTO> findByName(String name);

    CategoryResponseDTO update(Long id, CategoryRequestDTO request);

    void deleteById(Long id);

    

}