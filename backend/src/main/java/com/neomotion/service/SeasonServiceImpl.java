package com.neomotion.service;

import com.neomotion.dto.SeasonRequestDTO;
import com.neomotion.dto.SeasonResponseDTO;
import com.neomotion.entity.Season;
import com.neomotion.entity.Series;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.repository.SeasonRepository;
import com.neomotion.repository.SeriesRepository;
import org.springframework.stereotype.Service;
import com.neomotion.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class SeasonServiceImpl implements SeasonService {

    private final SeasonRepository seasonRepository;
    private final SeriesRepository seriesRepository;

    public SeasonServiceImpl(
            SeasonRepository seasonRepository,
            SeriesRepository seriesRepository) {

        this.seasonRepository = seasonRepository;
        this.seriesRepository = seriesRepository;
    }

    @Override
    public SeasonResponseDTO save(SeasonRequestDTO request) {

        if (seasonRepository.findBySeriesIdAndSeasonNumber(
                request.getSeriesId(),
                request.getSeasonNumber()
        ).isPresent()) {

            throw new ResourceConflictException
                    ("La temporada ya existe para esta serie");
        }

        Series series = seriesRepository.findById(request.getSeriesId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Serie no encontrada"));

        Season season = new Season();

        season.setSeasonNumber(request.getSeasonNumber());
        season.setTitle(request.getTitle());
        season.setDescription(request.getDescription());
        season.setActive(true);
        season.setSeries(series);

        Season savedSeason = seasonRepository.save(season);

        return toResponseDTO(savedSeason);
    }

    @Override
    public List<SeasonResponseDTO> findAll() {

        return seasonRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<SeasonResponseDTO> findById(Long id) {

        return seasonRepository.findById(id)
                .map(this::toResponseDTO);
    }

    @Override
    public List<SeasonResponseDTO> findBySeries(Long seriesId) {

        return seasonRepository.findBySeriesId(seriesId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public SeasonResponseDTO update(Long id, SeasonRequestDTO request) {

        Season existingSeason = seasonRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Temporada no encontrada"));

        if (seasonRepository
                .findBySeriesIdAndSeasonNumber(
                        request.getSeriesId(),
                        request.getSeasonNumber()
                )
                .filter(season -> !season.getId().equals(id))
                .isPresent()) {

            throw new ResourceConflictException(
                    "La temporada ya existe para esta serie"
            );
        }

        Series series = seriesRepository.findById(request.getSeriesId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Serie no encontrada"));

        existingSeason.setSeasonNumber(request.getSeasonNumber());
        existingSeason.setTitle(request.getTitle());
        existingSeason.setDescription(request.getDescription());
        existingSeason.setSeries(series);

        Season updatedSeason =
                seasonRepository.save(existingSeason);

        return toResponseDTO(updatedSeason);
    }
    @Override
    public void deleteById(Long id) {

        if (!seasonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Temporada no encontrada");
        }

        seasonRepository.deleteById(id);
    }
    private SeasonResponseDTO toResponseDTO(Season season) {

        SeasonResponseDTO response = new SeasonResponseDTO();

        response.setId(season.getId());
        response.setSeasonNumber(season.getSeasonNumber());
        response.setTitle(season.getTitle());
        response.setDescription(season.getDescription());
        response.setActive(season.getActive());
        response.setSeriesId(season.getSeries().getId());
        response.setSeriesTitle(season.getSeries().getTitle());

        return response;
    }
}