package com.neomotion.service;

import com.neomotion.dto.CurrentPlaybackResponseDTO;
import com.neomotion.dto.ScheduleRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    CurrentPlaybackResponseDTO findCurrentPlayback();

    ScheduleResponseDTO save(
            ScheduleRequestDTO request
    );

    ScheduleResponseDTO saveNext(
            ScheduleRequestDTO request
    );

    List<ScheduleResponseDTO> findAll();

    ScheduleResponseDTO findById(Long id);

    List<ScheduleResponseDTO> findByAirDate(
            LocalDate airDate
    );

    List<ScheduleResponseDTO> findByDateRange(
            LocalDate startDate,
            LocalDate endDate
    );

    List<ScheduleResponseDTO> findByEpisode(
            Long episodeId
    );


    List<ScheduleResponseDTO> findByMediaContent(
            Long mediaContentId
    );

    ScheduleResponseDTO update(
            Long id,
            ScheduleRequestDTO request
    );

    void deleteById(Long id);

    ScheduleResponseDTO findCurrent();

    ScheduleResponseDTO findNext();
}