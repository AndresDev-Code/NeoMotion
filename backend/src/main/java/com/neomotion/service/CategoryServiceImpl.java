package com.neomotion.service;

import com.neomotion.dto.CategoryRequestDTO;
import com.neomotion.dto.CategoryResponseDTO;
import com.neomotion.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import com.neomotion.entity.Category;
import java.util.List;
import java.util.Optional;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponseDTO save(CategoryRequestDTO request) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new ResourceConflictException("La categoría ya existe");
        }

        Category category = new Category();

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(true);

        Category savedCategory = categoryRepository.save(category);

        return toResponseDTO(savedCategory);
    }

    @Override
    public List<CategoryResponseDTO> findAll() {

        return categoryRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<CategoryResponseDTO> findById(Long id) {

        return categoryRepository.findById(id)
                .map(this::toResponseDTO);
    }

    @Override
    public Optional<CategoryResponseDTO> findByName(String name) {

        return categoryRepository.findByName(name)
                .map(this::toResponseDTO);
    }

    @Override
    public CategoryResponseDTO update(
            Long id,
            CategoryRequestDTO request) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría no encontrada."
                        ));

        if (categoryRepository.existsByName(request.getName())
                && !existingCategory.getName().equals(request.getName())) {

            throw new ResourceConflictException(
                    "La categoría ya existe."
            );
        }

        existingCategory.setName(request.getName());
        existingCategory.setDescription(request.getDescription());

        Category updatedCategory =
                categoryRepository.save(existingCategory);

        return toResponseDTO(updatedCategory);
    }

    @Override
    public void deleteById(Long id) {

        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Categoría no encontrada."
            );
        }

        categoryRepository.deleteById(id);
    }

    private CategoryResponseDTO toResponseDTO(Category category) {

        CategoryResponseDTO response = new CategoryResponseDTO();

        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setActive(category.getActive());

        return response;
    }

}