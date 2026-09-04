package com.neomotion.service;

import com.neomotion.dto.ScheduleRequestDTO;
import com.neomotion.dto.ScheduleResponseDTO;
import com.neomotion.entity.Episode;
import com.neomotion.entity.MediaContent;
import com.neomotion.entity.Schedule;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.EpisodeRepository;
import com.neomotion.repository.MediaContentRepository;
import com.neomotion.repository.ScheduleRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.neomotion.dto.CurrentPlaybackResponseDTO;
import com.neomotion.service.storage.StorageService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    private final EpisodeRepository episodeRepository;

    private final MediaContentRepository mediaContentRepository;




    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            EpisodeRepository episodeRepository,
            MediaContentRepository mediaContentRepository) {

        this.scheduleRepository =
                scheduleRepository;

        this.episodeRepository =
                episodeRepository;

        this.mediaContentRepository =
                mediaContentRepository;
    }


    // =================================================
    // CREAR PROGRAMACIÓN
    // =================================================

    @Override
    public ScheduleResponseDTO save(
            ScheduleRequestDTO request) {

        validarContenido(request);


        Schedule schedule =
                new Schedule();

        schedule.setAirDate(
                request.getAirDate()
        );

        schedule.setStartTime(
                request.getStartTime()
        );

        schedule.setActive(true);


        FragmentInfo fragmentInfo;


        // =============================================
        // EPISODIO
        // =============================================

        if (request.getEpisodeId() != null) {

            Episode episode =
                    episodeRepository.findById(
                                    request.getEpisodeId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Episodio no encontrado."
                                    )
                            );


            int totalDurationSeconds =
                    episode.getDurationMinutes() * 60;


            fragmentInfo =
                    calcularFragmentInfo(
                            request.getContentStartOffset(),
                            request.getContentEndOffset(),
                            totalDurationSeconds
                    );


            schedule.setEpisode(
                    episode
            );

            schedule.setMediaContent(
                    null
            );
        }


        // =============================================
        // CONTENIDO MULTIMEDIA
        // =============================================

        else {

            MediaContent mediaContent =
                    mediaContentRepository.findById(
                                    request.getMediaContentId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Contenido multimedia no encontrado."
                                    )
                            );


            int totalDurationSeconds =
                    mediaContent.getDurationSeconds();


            fragmentInfo =
                    calcularFragmentInfo(
                            request.getContentStartOffset(),
                            request.getContentEndOffset(),
                            totalDurationSeconds
                    );


            schedule.setMediaContent(
                    mediaContent
            );

            schedule.setEpisode(
                    null
            );
        }


        // =============================================
        // APLICAR INFORMACIÓN DEL FRAGMENTO
        // =============================================

        aplicarFragmentInfo(
                schedule,
                fragmentInfo
        );


        LocalTime endTime =
                request.getStartTime()
                        .plusSeconds(
                                fragmentInfo.getDurationSeconds()
                        );


        schedule.setEndTime(
                endTime
        );


        // =============================================
        // VALIDAR HORARIO
        // =============================================

        validarHorario(
                schedule.getStartTime(),
                schedule.getEndTime()
        );


        // =============================================
        // VALIDAR CONFLICTOS
        // =============================================

        List<Schedule> conflicts =
                scheduleRepository.findConflictingSchedules(
                        schedule.getAirDate(),
                        schedule.getStartTime(),
                        schedule.getEndTime()
                );


        if (!conflicts.isEmpty()) {

            throw new ResourceConflictException(
                    "Ya existe una programación que se cruza con este horario."
            );
        }


        Schedule saved =
                scheduleRepository.save(
                        schedule
                );

        return toResponseDTO(
                saved
        );
    }


// =================================================
// CREAR SIGUIENTE PROGRAMACIÓN
// =================================================

    @Override
    public ScheduleResponseDTO saveNext(
            ScheduleRequestDTO request) {

        validarContenido(request);


        // =============================================
        // BUSCAR ÚLTIMA PROGRAMACIÓN
        // =============================================

        Optional<Schedule> lastSchedule =
                scheduleRepository
                        .findTopByAirDateOrderByEndTimeDesc(
                                request.getAirDate()
                        );


        // =============================================
        // CALCULAR HORA DE INICIO
        // =============================================

        LocalTime startTime;


        if (lastSchedule.isPresent()) {

            startTime =
                    lastSchedule.get()
                            .getEndTime();

        } else {

            startTime =
                    LocalTime.MIDNIGHT;
        }


        // =============================================
        // CREAR PROGRAMACIÓN
        // =============================================

        Schedule schedule =
                new Schedule();

        schedule.setAirDate(
                request.getAirDate()
        );

        schedule.setStartTime(
                startTime
        );

        schedule.setActive(true);


        // =============================================
        // INFORMACIÓN DEL FRAGMENTO
        // =============================================

        FragmentInfo fragmentInfo;


        // =============================================
        // EPISODIO
        // =============================================

        if (request.getEpisodeId() != null) {

            Episode episode =
                    episodeRepository.findById(
                                    request.getEpisodeId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Episodio no encontrado."
                                    )
                            );


            // =============================================
            // DURACIÓN TOTAL DEL VIDEO
            // =============================================

            int totalDurationSeconds =
                    episode.getDurationMinutes() * 60;


            // =============================================
            // CALCULAR FRAGMENTO
            // =============================================

            fragmentInfo =
                    calcularFragmentInfo(
                            request.getContentStartOffset(),
                            request.getContentEndOffset(),
                            totalDurationSeconds
                    );


            // =============================================
            // ASIGNAR EPISODIO
            // =============================================

            schedule.setEpisode(
                    episode
            );

            schedule.setMediaContent(
                    null
            );
        }


        // =============================================
        // CONTENIDO MULTIMEDIA
        // =============================================

        else {

            MediaContent mediaContent =
                    mediaContentRepository.findById(
                                    request.getMediaContentId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Contenido multimedia no encontrado."
                                    )
                            );


            // =============================================
            // DURACIÓN TOTAL DEL VIDEO
            // =============================================

            int totalDurationSeconds =
                    mediaContent.getDurationSeconds();


            // =============================================
            // CALCULAR FRAGMENTO
            // =============================================

            fragmentInfo =
                    calcularFragmentInfo(
                            request.getContentStartOffset(),
                            request.getContentEndOffset(),
                            totalDurationSeconds
                    );


            // =============================================
            // ASIGNAR CONTENIDO MULTIMEDIA
            // =============================================

            schedule.setMediaContent(
                    mediaContent
            );

            schedule.setEpisode(
                    null
            );
        }


        // =============================================
        // APLICAR INFORMACIÓN DEL FRAGMENTO
        // =============================================

        aplicarFragmentInfo(
                schedule,
                fragmentInfo
        );


        // =============================================
        // CALCULAR HORA FINAL
        // =============================================

        LocalTime endTime =
                startTime.plusSeconds(
                        fragmentInfo.getDurationSeconds()
                );


        // =============================================
        // VALIDAR CAMBIO DE DÍA
        // =============================================

        if (!endTime.isAfter(startTime)) {

            throw new ResourceConflictException(
                    "El contenido supera el límite del día. " +
                            "La programación que cruza medianoche aún no está soportada."
            );
        }


        schedule.setEndTime(
                endTime
        );

          // =============================================
          // VALIDAR CONFLICTOS
          // =============================================

        List<Schedule> conflicts =
                scheduleRepository.findConflictingSchedules(
                        schedule.getAirDate(),
                        schedule.getStartTime(),
                        schedule.getEndTime()
                );


        if (!conflicts.isEmpty()) {

            throw new ResourceConflictException(
                    "Ya existe una programación que se cruza con este horario."
            );
        }


        // =============================================
        // GUARDAR
        // =============================================

        Schedule saved =
                scheduleRepository.save(
                        schedule
                );

        return toResponseDTO(
                saved
        );
    }


    // =================================================
    // OBTENER TODOS
    // =================================================

    @Override
    public List<ScheduleResponseDTO> findAll() {

        return scheduleRepository
                .findAllByOrderByAirDateAscStartTimeAsc()
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


    // =================================================
    // OBTENER POR ID
    // =================================================

    @Override
    public ScheduleResponseDTO findById(
            Long id) {

        Schedule schedule =
                scheduleRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Horario no encontrado."
                                )
                        );

        return toResponseDTO(
                schedule
        );
    }
     // =================================================
    // OBTENER POR RANGO DE FECHAS
    // =================================================

    @Override
    public List<ScheduleResponseDTO> findByDateRange(
            LocalDate startDate,
            LocalDate endDate) {

        if (endDate.isBefore(startDate)) {

            throw new ResourceConflictException(
                    "La fecha final no puede ser anterior a la fecha inicial."
            );
        }

        return scheduleRepository
                .findByAirDateBetweenOrderByAirDateAscStartTimeAsc(
                        startDate,
                        endDate
                )
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


    // =================================================
    // OBTENER POR FECHA
    // =================================================

    @Override
    public List<ScheduleResponseDTO> findByAirDate(
            LocalDate airDate) {

        return scheduleRepository
                .findByAirDateOrderByStartTimeAsc(
                        airDate
                )
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


    // =================================================
    // OBTENER POR EPISODIO
    // =================================================

    @Override
    public List<ScheduleResponseDTO> findByEpisode(
            Long episodeId) {

        return scheduleRepository
                .findByEpisodeId(
                        episodeId
                )
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


    // =================================================
    // OBTENER POR MEDIA CONTENT
    // =================================================

    @Override
    public List<ScheduleResponseDTO> findByMediaContent(
            Long mediaContentId) {

        return scheduleRepository
                .findByMediaContentId(
                        mediaContentId
                )
                .stream()
                .map(
                        this::toResponseDTO
                )
                .toList();
    }


// =================================================
// ACTUALIZAR PROGRAMACIÓN
// =================================================

    @Override
    public ScheduleResponseDTO update(
            Long id,
            ScheduleRequestDTO request) {

        // =============================================
        // VALIDAR CONTENIDO
        // =============================================

        validarContenido(request);


        // =============================================
        // BUSCAR PROGRAMACIÓN
        // =============================================

        Schedule schedule =
                scheduleRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Horario no encontrado."
                                )
                        );


        // =============================================
        // INFORMACIÓN DEL FRAGMENTO
        // =============================================

        FragmentInfo fragmentInfo;


        // =============================================
        // EPISODIO
        // =============================================

        if (request.getEpisodeId() != null) {

            Episode episode =
                    episodeRepository.findById(
                                    request.getEpisodeId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Episodio no encontrado."
                                    )
                            );


            // =============================================
            // DURACIÓN TOTAL DEL VIDEO
            // =============================================

            int totalDurationSeconds =
                    episode.getDurationMinutes() * 60;


            // =============================================
            // CALCULAR FRAGMENTO
            // =============================================

            fragmentInfo =
                    calcularFragmentInfo(
                            request.getContentStartOffset(),
                            request.getContentEndOffset(),
                            totalDurationSeconds
                    );


            // =============================================
            // ASIGNAR EPISODIO
            // =============================================

            schedule.setEpisode(
                    episode
            );

            schedule.setMediaContent(
                    null
            );
        }


        // =============================================
        // CONTENIDO MULTIMEDIA
        // =============================================

        else {

            MediaContent mediaContent =
                    mediaContentRepository.findById(
                                    request.getMediaContentId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Contenido multimedia no encontrado."
                                    )
                            );


            // =============================================
            // DURACIÓN TOTAL DEL VIDEO
            // =============================================

            int totalDurationSeconds =
                    mediaContent.getDurationSeconds();


            // =============================================
            // CALCULAR FRAGMENTO
            // =============================================

            fragmentInfo =
                    calcularFragmentInfo(
                            request.getContentStartOffset(),
                            request.getContentEndOffset(),
                            totalDurationSeconds
                    );


            // =============================================
            // ASIGNAR CONTENIDO MULTIMEDIA
            // =============================================

            schedule.setMediaContent(
                    mediaContent
            );

            schedule.setEpisode(
                    null
            );
        }


        // =============================================
        // APLICAR INFORMACIÓN DEL FRAGMENTO
        // =============================================

        aplicarFragmentInfo(
                schedule,
                fragmentInfo
        );


        // =============================================
        // CALCULAR HORA FINAL
        // =============================================

        LocalTime endTime =
                request.getStartTime()
                        .plusSeconds(
                                fragmentInfo.getDurationSeconds()
                        );


        // =============================================
        // VALIDAR HORARIO
        // =============================================

        validarHorario(
                request.getStartTime(),
                endTime
        );


        // =============================================
        // VALIDAR CONFLICTOS
        // =============================================

        List<Schedule> conflicts =
                scheduleRepository
                        .findConflictingSchedulesForUpdate(
                                request.getAirDate(),
                                request.getStartTime(),
                                endTime,
                                id
                        );


        if (!conflicts.isEmpty()) {

            throw new ResourceConflictException(
                    "Ya existe una programación que se cruza con este horario."
            );
        }


        // =============================================
        // ACTUALIZAR DATOS DEL HORARIO
        // =============================================

        schedule.setAirDate(
                request.getAirDate()
        );

        schedule.setStartTime(
                request.getStartTime()
        );

        schedule.setEndTime(
                endTime
        );


        // =============================================
        // GUARDAR CAMBIOS
        // =============================================

        Schedule updated =
                scheduleRepository.save(
                        schedule
                );


        return toResponseDTO(
                updated
        );
    }


    // =================================================
    // ELIMINAR
    // =================================================

    @Override
    public void deleteById(
            Long id) {

        if (!scheduleRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Horario no encontrado."
            );
        }

        scheduleRepository.deleteById(
                id
        );
    }


    // =================================================
    // PROGRAMA ACTUAL
    // =================================================

    @Override
    public ScheduleResponseDTO findCurrent() {

        Schedule schedule =
                scheduleRepository
                        .findCurrentSchedule(
                                LocalDate.now(),
                                LocalTime.now()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No hay ningún programa transmitiéndose en este momento."
                                )
                        );

        return toResponseDTO(
                schedule
        );
    }

    // =================================================
// REPRODUCCIÓN ACTUAL
// =================================================

    @Override
    public CurrentPlaybackResponseDTO findCurrentPlayback() {

        // =============================================
        // BUSCAR PROGRAMACIÓN ACTUAL
        // =============================================

        LocalDate currentDate =
                LocalDate.now();

        LocalTime currentTime =
                LocalTime.now();


        Schedule schedule =
                scheduleRepository
                        .findCurrentSchedule(
                                currentDate,
                                currentTime
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No hay ningún programa transmitiéndose en este momento."
                                )
                        );


        // =============================================
        // CALCULAR SEGUNDOS TRANSCURRIDOS
        // =============================================

        long elapsedSeconds =
                java.time.Duration
                        .between(
                                schedule.getStartTime(),
                                currentTime
                        )
                        .getSeconds();


        // =============================================
        // CALCULAR POSICIÓN REAL DEL VIDEO
        // =============================================

        int playbackStartSeconds =
                schedule.getContentStartOffset()
                        + (int) elapsedSeconds;


        int playbackEndSeconds =
                schedule.getContentEndOffset();


        // =============================================
        // CREAR RESPUESTA
        // =============================================

        CurrentPlaybackResponseDTO response =
                new CurrentPlaybackResponseDTO();


        response.setScheduleId(
                schedule.getId()
        );


        response.setPlaybackStartSeconds(
                playbackStartSeconds
        );

        response.setPlaybackEndSeconds(
                playbackEndSeconds
        );


        // =============================================
        // EPISODIO
        // =============================================

        if (schedule.getEpisode() != null) {

            Episode episode =
                    schedule.getEpisode();


            response.setContentType(
                    "EPISODE"
            );

            response.setTitle(
                    episode.getTitle()
            );

            response.setVideoUrl(
                    episode.getVideoUrl()
            );
        }


        // =============================================
        // CONTENIDO MULTIMEDIA
        // =============================================

        else if (schedule.getMediaContent() != null) {

            MediaContent mediaContent =
                    schedule.getMediaContent();


            response.setContentType(
                    "MEDIA_CONTENT"
            );

            response.setTitle(
                    mediaContent.getTitle()
            );

            response.setVideoUrl(
                    mediaContent.getVideoUrl()
            );
        }


        return response;
    }


    // =================================================
    // SIGUIENTE PROGRAMA
    // =================================================

    @Override
    public ScheduleResponseDTO findNext() {

        List<Schedule> schedules =
                scheduleRepository.findNextSchedule(
                        LocalDate.now(),
                        LocalTime.now(),
                        PageRequest.of(
                                0,
                                1
                        )
                );


        Schedule schedule =
                schedules.stream()
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No hay ningún programa programado próximamente."
                                )
                        );

        return toResponseDTO(
                schedule
        );
    }


    // =================================================
    // VALIDAR CONTENIDO
    // =================================================

    private void validarContenido(
            ScheduleRequestDTO request) {

        boolean tieneEpisode =
                request.getEpisodeId() != null;

        boolean tieneMediaContent =
                request.getMediaContentId() != null;


        if (tieneEpisode && tieneMediaContent) {

            throw new ResourceConflictException(
                    "Una programación no puede tener un episodio " +
                            "y un contenido multimedia al mismo tiempo."
            );
        }


        if (!tieneEpisode && !tieneMediaContent) {

            throw new ResourceConflictException(
                    "La programación debe tener un episodio " +
                            "o un contenido multimedia."
            );
        }
    }


    // =================================================
    // VALIDAR HORARIO
    // =================================================

    private void validarHorario(
            LocalTime startTime,
            LocalTime endTime) {

        if (!endTime.isAfter(startTime)) {

            throw new ResourceConflictException(
                    "La hora de finalización debe ser posterior " +
                            "a la hora de inicio."
            );
        }
    }


    // =================================================
// CALCULAR INFORMACIÓN DEL FRAGMENTO
// =================================================

    private FragmentInfo calcularFragmentInfo(
            Integer contentStartOffset,
            Integer contentEndOffset,
            int totalDurationSeconds) {

        int startOffset;

        if (contentStartOffset == null) {

            startOffset = 0;

        } else {

            startOffset =
                    contentStartOffset;
        }


        int endOffset;

        if (contentEndOffset == null) {

            endOffset =
                    totalDurationSeconds;

        } else {

            endOffset =
                    contentEndOffset;
        }


        // =============================================
        // VALIDAR OFFSET INICIAL
        // =============================================

        if (startOffset < 0) {

            throw new ResourceConflictException(
                    "El inicio del contenido no puede ser negativo."
            );
        }


        // =============================================
        // VALIDAR OFFSET FINAL
        // =============================================

        if (endOffset > totalDurationSeconds) {

            throw new ResourceConflictException(
                    "El final del contenido supera la duración " +
                            "total del video."
            );
        }


        // =============================================
        // VALIDAR ORDEN
        // =============================================

        if (endOffset <= startOffset) {

            throw new ResourceConflictException(
                    "El final del fragmento debe ser mayor " +
                            "que su inicio."
            );
        }


        int durationSeconds =
                endOffset - startOffset;


        return new FragmentInfo(
                startOffset,
                endOffset,
                durationSeconds
        );
    }


    // =================================================
    // APLICAR INFORMACIÓN DEL FRAGMENTO
    // =================================================

    private void aplicarFragmentInfo(
            Schedule schedule,
            FragmentInfo fragmentInfo) {

        schedule.setContentStartOffset(
                fragmentInfo.getStartOffset()
        );

        schedule.setContentEndOffset(
                fragmentInfo.getEndOffset()
        );
    }


    // =================================================
    // CONVERTIR A RESPONSE DTO
    // =================================================

    private ScheduleResponseDTO toResponseDTO(
            Schedule schedule) {

        ScheduleResponseDTO response =
                new ScheduleResponseDTO();


        response.setId(
                schedule.getId()
        );

        response.setAirDate(
                schedule.getAirDate()
        );

        response.setStartTime(
                schedule.getStartTime()
        );

        response.setEndTime(
                schedule.getEndTime()
        );

        response.setActive(
                schedule.getActive()
        );


        // =============================================
        // INFORMACIÓN DEL FRAGMENTO
        // =============================================

        response.setContentStartOffset(
                schedule.getContentStartOffset()
        );

        response.setContentEndOffset(
                schedule.getContentEndOffset()
        );

        // =============================================
// BLOQUE DE PROGRAMACIÓN
// =============================================

        if (
                schedule.getProgrammingBlock() != null
        ) {

            response.setProgrammingBlockId(
                    schedule
                            .getProgrammingBlock()
                            .getId()
            );


            response.setProgrammingBlockName(
                    schedule
                            .getProgrammingBlock()
                            .getName()
            );
        }

        // =============================================
        // EPISODIO
        // =============================================

        if (schedule.getEpisode() != null) {

            Episode episode =
                    schedule.getEpisode();


            response.setContentType(
                    "EPISODE"
            );

            response.setEpisodeId(
                    episode.getId()
            );

            response.setEpisodeNumber(
                    episode.getEpisodeNumber()
            );

            response.setEpisodeTitle(
                    episode.getTitle()
            );


            if (episode.getSeason() != null) {

                response.setSeasonTitle(
                        episode.getSeason()
                                .getTitle()
                );


                if (episode.getSeason()
                        .getSeries() != null) {

                    response.setSeriesTitle(
                            episode.getSeason()
                                    .getSeries()
                                    .getTitle()
                    );
                }
            }


            response.setVideoUrl(
                    episode.getVideoUrl()
            );
        }


        // =============================================
        // MEDIA CONTENT
        // =============================================

        if (schedule.getMediaContent() != null) {

            MediaContent mediaContent =
                    schedule.getMediaContent();


            response.setContentType(
                    "MEDIA_CONTENT"
            );

            response.setMediaContentId(
                    mediaContent.getId()
            );

            response.setMediaContentTitle(
                    mediaContent.getTitle()
            );

            response.setMediaContentDescription(
                    mediaContent.getDescription()
            );

            response.setMediaContentType(
                    mediaContent.getType()
            );

            response.setVideoUrl(
                    mediaContent.getVideoUrl()
            );
        }


        return response;
    }
}