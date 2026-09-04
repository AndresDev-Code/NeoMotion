package com.neomotion.service;

import com.neomotion.dto.EpisodeRequestDTO;
import com.neomotion.dto.EpisodeResponseDTO;
import com.neomotion.entity.Episode;
import com.neomotion.entity.Schedule;
import com.neomotion.entity.Season;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.EpisodeRepository;
import com.neomotion.repository.SeasonRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.neomotion.service.storage.StorageService;
import com.neomotion.repository.ScheduleRepository;
import java.util.List;
import java.util.Optional;

@Service
public class EpisodeServiceImpl implements EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final SeasonRepository seasonRepository;
    private final ScheduleRepository scheduleRepository;
    private final StorageService storageService;

    public EpisodeServiceImpl(
            EpisodeRepository episodeRepository,
            SeasonRepository seasonRepository,
            StorageService storageService,
            ScheduleRepository scheduleRepository) {

        this.episodeRepository = episodeRepository;
        this.seasonRepository = seasonRepository;
        this.storageService = storageService;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public EpisodeResponseDTO save(EpisodeRequestDTO request) {

        if (episodeRepository.findBySeasonIdAndEpisodeNumber(
                request.getSeasonId(),
                request.getEpisodeNumber()).isPresent()) {

            throw new ResourceConflictException("El episodio ya existe en esta temporada.");
        }

        Season season = seasonRepository.findById(request.getSeasonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Temporada no encontrada."));

        Episode episode = new Episode();

        episode.setEpisodeNumber(request.getEpisodeNumber());
        episode.setTitle(request.getTitle());
        episode.setDescription(request.getDescription());
        episode.setDurationMinutes(request.getDurationMinutes());
        episode.setThumbnail(request.getThumbnail());
        episode.setVideoUrl(request.getVideoUrl());
        episode.setActive(true);
        episode.setSeason(season);

        Episode saved = episodeRepository.save(episode);

        return toResponseDTO(saved);
    }

    @Override
    public List<EpisodeResponseDTO> findAll() {

        return episodeRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public EpisodeResponseDTO findById(Long id) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Episodio no encontrado."
                        )
                );

        return toResponseDTO(episode);
    }

    @Override
    public List<EpisodeResponseDTO> findBySeason(Long seasonId) {

        return episodeRepository.findBySeasonId(seasonId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public EpisodeResponseDTO update(
            Long id,
            EpisodeRequestDTO request) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Episodio no encontrado."
                        ));

        Season season = seasonRepository.findById(
                        request.getSeasonId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Temporada no encontrada."
                        ));

        Optional<Episode> existingEpisode =
                episodeRepository.findBySeasonIdAndEpisodeNumber(
                        request.getSeasonId(),
                        request.getEpisodeNumber()
                );

        if (existingEpisode.isPresent()
                && !existingEpisode.get().getId().equals(id)) {

            throw new ResourceConflictException(
                    "El episodio ya existe en esta temporada."
            );
        }


        // =============================================
        // GUARDAR REFERENCIAS DE ARCHIVOS ANTERIORES
        // =============================================

        String oldThumbnail =
                episode.getThumbnail();

        String oldVideo =
                episode.getVideoUrl();


        // =============================================
        // ACTUALIZAR EPISODIO
        // =============================================

        episode.setEpisodeNumber(
                request.getEpisodeNumber()
        );

        episode.setTitle(
                request.getTitle()
        );

        episode.setDescription(
                request.getDescription()
        );

        episode.setDurationMinutes(
                request.getDurationMinutes()
        );

        episode.setThumbnail(
                request.getThumbnail()
        );

        episode.setVideoUrl(
                request.getVideoUrl()
        );

        episode.setSeason(season);


        // =============================================
        // GUARDAR CAMBIOS
        // =============================================

        Episode updated =
                episodeRepository.save(episode);


        // =============================================
        // ELIMINAR MINIATURA ANTERIOR
        // =============================================

        if (oldThumbnail != null
                && !oldThumbnail.equals(
                request.getThumbnail()
        )) {

            storageService.deleteImage(
                    extractFilename(oldThumbnail)
            );
        }


        // =============================================
        // ELIMINAR VIDEO ANTERIOR
        // =============================================

        if (oldVideo != null
                && !oldVideo.equals(
                request.getVideoUrl()
        )) {

            storageService.deleteVideo(
                    extractFilename(oldVideo)
            );
        }


        return toResponseDTO(updated);
    }

    @Override
    public void deleteById(Long id) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Episodio no encontrado."
                        )
                );

        // =============================================
        // VALIDAR PROGRAMACIONES ASOCIADAS
        // =============================================

        if (!scheduleRepository.findByEpisodeId(id).isEmpty()) {

            throw new ResourceConflictException(
                    "No se puede eliminar el episodio porque está programado en la parrilla."
            );
        }


        // =============================================
        // GUARDAR REFERENCIAS DE ARCHIVOS
        // =============================================

        String thumbnail = episode.getThumbnail();
        String video = episode.getVideoUrl();


        // =============================================
        // ELIMINAR EPISODIO
        // =============================================

        episodeRepository.delete(episode);


        // =============================================
        // ELIMINAR ARCHIVOS ASOCIADOS
        // =============================================

        if (thumbnail != null) {
            storageService.deleteImage(
                    extractFilename(thumbnail)
            );
        }

        if (video != null) {
            storageService.deleteVideo(
                    extractFilename(video)
            );
        }
    }

    private String extractFilename(String filePath) {

        if (filePath == null || filePath.isBlank()) {
            return null;
        }

        int lastSlashIndex =
                filePath.lastIndexOf("/");

        if (lastSlashIndex == -1) {
            return filePath;
        }

        return filePath.substring(
                lastSlashIndex + 1
        );
    }

    private EpisodeResponseDTO toResponseDTO(Episode episode) {

        EpisodeResponseDTO response = new EpisodeResponseDTO();

        response.setId(episode.getId());
        response.setEpisodeNumber(episode.getEpisodeNumber());
        response.setTitle(episode.getTitle());
        response.setDescription(episode.getDescription());
        response.setDurationMinutes(episode.getDurationMinutes());
        response.setThumbnail(episode.getThumbnail());
        response.setVideoUrl(episode.getVideoUrl());
        response.setActive(episode.getActive());

        response.setSeasonId(
                episode.getSeason().getId()
        );

        response.setSeasonTitle(
                episode.getSeason().getTitle()
        );

        return response;
    }

}