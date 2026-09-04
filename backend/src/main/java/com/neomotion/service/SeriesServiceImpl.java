package com.neomotion.service;

import com.neomotion.dto.SeriesRequestDTO;
import com.neomotion.dto.SeriesResponseDTO;
import com.neomotion.entity.Category;
import com.neomotion.entity.Series;
import com.neomotion.repository.CategoryRepository;
import com.neomotion.repository.SeriesRepository;
import org.springframework.stereotype.Service;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;


import java.util.List;
import java.util.Optional;

@Service
public class SeriesServiceImpl implements SeriesService {

    private final SeriesRepository seriesRepository;
    private final CategoryRepository categoryRepository;

    public SeriesServiceImpl(
            SeriesRepository seriesRepository,
            CategoryRepository categoryRepository) {

        this.seriesRepository = seriesRepository;
        this.categoryRepository = categoryRepository;
    }
    @Override
    public SeriesResponseDTO save(SeriesRequestDTO request) {

        if (seriesRepository.existsByTitle(request.getTitle())) {
            throw new ResourceConflictException(
                    "La serie ya existe."
            );
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría no encontrada."
                        )
                );

        Series series = new Series();

        series.setTitle(request.getTitle());
        series.setDescription(request.getDescription());
        series.setReleaseYear(request.getReleaseYear());
        series.setStudio(request.getStudio());
        series.setImageUrl(request.getImageUrl());
        series.setActive(true);
        series.setCategory(category);

        Series savedSeries = seriesRepository.save(series);

        return toResponseDTO(savedSeries);
    }



    @Override
    public List<SeriesResponseDTO> findAll() {

        return seriesRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<SeriesResponseDTO> findById(Long id) {

        return seriesRepository.findById(id)
                .map(this::toResponseDTO);
    }
    @Override
    public Optional<SeriesResponseDTO> findByTitle(String title) {

        return seriesRepository.findByTitle(title)
                .map(this::toResponseDTO);
    }
    @Override
    public SeriesResponseDTO update(Long id, SeriesRequestDTO request) {

        Series existingSeries = seriesRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Serie no encontrada"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (seriesRepository.existsByTitle(request.getTitle())
                && !existingSeries.getTitle().equals(request.getTitle())) {

            throw new ResourceConflictException(
                    "La serie ya existe."
            );
        }

        existingSeries.setTitle(request.getTitle());
        existingSeries.setDescription(request.getDescription());
        existingSeries.setReleaseYear(request.getReleaseYear());
        existingSeries.setStudio(request.getStudio());
        existingSeries.setImageUrl(request.getImageUrl());
        existingSeries.setCategory(category);

        Series updatedSeries = seriesRepository.save(existingSeries);

        return toResponseDTO(updatedSeries);
    }

    @Override
    public void deleteById(Long id) {

        if (!seriesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Serie no encontrada");
        }

        seriesRepository.deleteById(id);
    }

    private SeriesResponseDTO toResponseDTO(Series series) {

        SeriesResponseDTO response = new SeriesResponseDTO();

        response.setId(series.getId());
        response.setTitle(series.getTitle());
        response.setDescription(series.getDescription());
        response.setReleaseYear(series.getReleaseYear());
        response.setStudio(series.getStudio());
        response.setImageUrl(series.getImageUrl());
        response.setActive(series.getActive());
        response.setCategory(series.getCategory().getName());

        return response;
    }

}