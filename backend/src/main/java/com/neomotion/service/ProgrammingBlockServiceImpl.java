package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockItemRequestDTO;
import com.neomotion.dto.ProgrammingBlockItemResponseDTO;
import com.neomotion.dto.ProgrammingBlockRequestDTO;
import com.neomotion.dto.ProgrammingBlockResponseDTO;
import com.neomotion.entity.*;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.neomotion.dto.ScheduleResponseDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProgrammingBlockServiceImpl
        implements ProgrammingBlockService {

    private final ProgrammingBlockRepository programmingBlockRepository;

    private final ProgrammingBlockItemRepository programmingBlockItemRepository;

    private final EpisodeRepository episodeRepository;

    private final MediaContentRepository mediaContentRepository;

    private final ScheduleRepository scheduleRepository;


    public ProgrammingBlockServiceImpl(
            ProgrammingBlockRepository programmingBlockRepository,
            ProgrammingBlockItemRepository programmingBlockItemRepository,
            EpisodeRepository episodeRepository,
            MediaContentRepository mediaContentRepository,
            ScheduleRepository scheduleRepository) {

        this.programmingBlockRepository =
                programmingBlockRepository;

        this.programmingBlockItemRepository =
                programmingBlockItemRepository;

        this.episodeRepository =
                episodeRepository;

        this.mediaContentRepository =
                mediaContentRepository;

        this.scheduleRepository =
                scheduleRepository;
    }


    // =================================================
    // CREAR BLOQUE
    // =================================================

    @Override
    @Transactional
    public ProgrammingBlockResponseDTO save(
            ProgrammingBlockRequestDTO request) {

        validarItems(
                request.getItems()
        );


        ProgrammingBlock block =
                new ProgrammingBlock();


        block.setName(
                request.getName()
        );


        block.setDescription(
                request.getDescription()
        );


        block.setActive(
                true
        );


        ProgrammingBlock savedBlock =
                programmingBlockRepository.save(
                        block
                );


        guardarItems(
                savedBlock,
                request.getItems()
        );


        return toResponseDTO(
                savedBlock
        );
    }


    // =================================================
    // OBTENER TODOS
    // =================================================

    @Override
    @Transactional
    public List<ProgrammingBlockResponseDTO> findAll() {

        return programmingBlockRepository
                .findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    // =================================================
    // OBTENER POR ID
    // =================================================

    @Override
    @Transactional
    public ProgrammingBlockResponseDTO findById(
            Long id) {

        ProgrammingBlock block =
                programmingBlockRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bloque de programación no encontrado."
                                )
                        );


        return toResponseDTO(
                block
        );
    }


    // =================================================
    // ACTUALIZAR
    // =================================================

    @Override
    @Transactional
    public ProgrammingBlockResponseDTO update(
            Long id,
            ProgrammingBlockRequestDTO request) {

        validarItems(
                request.getItems()
        );


        ProgrammingBlock block =
                programmingBlockRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bloque de programación no encontrado."
                                )
                        );


        // =============================================
        // ACTUALIZAR DATOS DEL BLOQUE
        // =============================================

        block.setName(
                request.getName()
        );


        block.setDescription(
                request.getDescription()
        );


        // =============================================
        // OBTENER ITEMS ACTUALES
        // =============================================

        List<ProgrammingBlockItem> existingItems =
                programmingBlockItemRepository
                        .findByProgrammingBlockIdOrderByPositionAsc(
                                id
                        );


        // =============================================
        // REEMPLAZAR ITEMS DEL BLOQUE
        // =============================================

        programmingBlockItemRepository.deleteAll(
                existingItems
        );


        programmingBlockItemRepository.flush();


        guardarItems(
                block,
                request.getItems()
        );


        ProgrammingBlock updatedBlock =
                programmingBlockRepository.save(
                        block
                );


        // =============================================
        // SINCRONIZAR EMISIONES FUTURAS
        // =============================================

        sincronizarEmisionesFuturas(
                updatedBlock
        );


        return toResponseDTO(
                updatedBlock
        );
    }
    // =================================================
// SINCRONIZAR EMISIONES FUTURAS
// =================================================

    private void sincronizarEmisionesFuturas(
            ProgrammingBlock block) {

        LocalDate currentDate =
                LocalDate.now();

        LocalTime currentTime =
                LocalTime.now();


        // =============================================
        // BUSCAR SOLAMENTE EMISIONES FUTURAS
        // =============================================

        List<Schedule> futureSchedules =
                scheduleRepository
                        .findFutureSchedulesByProgrammingBlockId(
                                block.getId(),
                                currentDate,
                                currentTime
                        );


        if (
                futureSchedules.isEmpty()
        ) {

            return;
        }


        // =============================================
        // OBTENER LOS ITEMS ACTUALIZADOS
        // =============================================

        List<ProgrammingBlockItem> blockItems =
                programmingBlockItemRepository
                        .findByProgrammingBlockIdOrderByPositionAsc(
                                block.getId()
                        );


        if (
                blockItems.isEmpty()
        ) {

            return;
        }


        // =============================================
        // AGRUPAR EMISIONES POR OCURRENCIA
        // =============================================

        List<List<Schedule>> occurrences =
                agruparEmisionesPorOcurrencia(
                        futureSchedules
                );


        // =============================================
        // SINCRONIZAR CADA OCURRENCIA
        // =============================================

        for (
                List<Schedule> occurrence :
                occurrences
        ) {

            sincronizarOcurrencia(
                    occurrence,
                    blockItems,
                    block
            );
        }
    }
    // =================================================
// AGRUPAR EMISIONES POR OCURRENCIA
// =================================================

    private List<List<Schedule>> agruparEmisionesPorOcurrencia(
            List<Schedule> schedules) {

        List<List<Schedule>> occurrences =
                new ArrayList<>();


        if (
                schedules.isEmpty()
        ) {

            return occurrences;
        }


        List<Schedule> currentOccurrence =
                new ArrayList<>();


        Schedule previous =
                null;


        for (
                Schedule schedule :
                schedules
        ) {

            boolean sameOccurrence =
                    previous != null
                            &&
                            previous.getAirDate()
                                    .equals(
                                            schedule.getAirDate()
                                    )
                            &&
                            previous.getEndTime()
                                    .equals(
                                            schedule.getStartTime()
                                    );


            if (
                    !sameOccurrence
            ) {

                if (
                        !currentOccurrence.isEmpty()
                ) {

                    occurrences.add(
                            currentOccurrence
                    );
                }


                currentOccurrence =
                        new ArrayList<>();
            }


            currentOccurrence.add(
                    schedule
            );


            previous =
                    schedule;
        }


        if (
                !currentOccurrence.isEmpty()
        ) {

            occurrences.add(
                    currentOccurrence
            );
        }


        return occurrences;
    }
    // =================================================
// SINCRONIZAR UNA OCURRENCIA
// =================================================

    private void sincronizarOcurrencia(
            List<Schedule> existingSchedules,
            List<ProgrammingBlockItem> blockItems,
            ProgrammingBlock block) {

        Schedule firstSchedule =
                existingSchedules.get(0);


        LocalDate airDate =
                firstSchedule.getAirDate();


        LocalTime currentStartTime =
                firstSchedule.getStartTime();

        validarConflictosDeOcurrencia(
                existingSchedules,
                blockItems,
                airDate,
                currentStartTime
        );

        int schedulesToReuse =
                Math.min(
                        existingSchedules.size(),
                        blockItems.size()
                );


        // =============================================
        // ACTUALIZAR Y REUTILIZAR SCHEDULES EXISTENTES
        // =============================================

        for (
                int i = 0;
                i < schedulesToReuse;
                i++
        ) {

            Schedule schedule =
                    existingSchedules.get(i);


            ProgrammingBlockItem item =
                    blockItems.get(i);


            int duration =
                    calcularDuracionItem(
                            item
                    );


            LocalTime endTime =
                    currentStartTime.plusSeconds(
                            duration
                    );


            actualizarScheduleDesdeItem(
                    schedule,
                    item,
                    block,
                    airDate,
                    currentStartTime,
                    endTime
            );


            currentStartTime =
                    endTime;
        }


        // =============================================
        // CREAR NUEVOS SCHEDULES
        // =============================================

        for (
                int i = schedulesToReuse;
                i < blockItems.size();
                i++
        ) {

            ProgrammingBlockItem item =
                    blockItems.get(i);


            int duration =
                    calcularDuracionItem(
                            item
                    );


            LocalTime endTime =
                    currentStartTime.plusSeconds(
                            duration
                    );


            Schedule schedule =
                    crearScheduleDesdeItem(
                            item,
                            block,
                            airDate,
                            currentStartTime,
                            endTime
                    );


            scheduleRepository.save(
                    schedule
            );


            currentStartTime =
                    endTime;
        }


        // =============================================
        // DESACTIVAR SCHEDULES SOBRANTES
        // =============================================

        for (
                int i = blockItems.size();
                i < existingSchedules.size();
                i++
        ) {

            Schedule schedule =
                    existingSchedules.get(i);


            schedule.setActive(
                    false
            );


            scheduleRepository.save(
                    schedule
            );
        }
    }

    // =================================================
    // VALIDAR CONFLICTOS DE UNA OCURRENCIA
    // =================================================

    private void validarConflictosDeOcurrencia(
            List<Schedule> existingSchedules,
            List<ProgrammingBlockItem> blockItems,
            LocalDate airDate,
            LocalTime startTime) {

        LocalTime currentStartTime =
                startTime;


        Set<Long> scheduleIds =
                new HashSet<>();


        for (
                Schedule schedule :
                existingSchedules
        ) {

            if (
                    schedule.getId() != null
            ) {

                scheduleIds.add(
                        schedule.getId()
                );
            }
        }


        for (
                ProgrammingBlockItem item :
                blockItems
        ) {

            int duration =
                    calcularDuracionItem(
                            item
                    );


            LocalTime endTime =
                    currentStartTime.plusSeconds(
                            duration
                    );


            List<Schedule> conflicts =
                    scheduleRepository
                            .findConflictingSchedules(
                                    airDate,
                                    currentStartTime,
                                    endTime
                            );


            for (
                    Schedule conflict :
                    conflicts
            ) {

                // =========================================
                // IGNORAR LOS SCHEDULES QUE VAMOS A REUTILIZAR
                // =========================================

                if (
                        conflict.getId() != null &&
                                scheduleIds.contains(
                                        conflict.getId()
                                )
                ) {

                    continue;
                }


                throw new ResourceConflictException(
                        "La actualización del bloque genera " +
                                "un conflicto de horario entre " +
                                currentStartTime +
                                " y " +
                                endTime +
                                "."
                );
            }


            currentStartTime =
                    endTime;
        }
    }

    // =================================================
   // CALCULAR DURACIÓN DEL ITEM
   // =================================================

    private int calcularDuracionItem(
            ProgrammingBlockItem item) {

        int startOffset =
                item.getContentStartOffset();


        int endOffset;


        if (
                item.getContentEndOffset() != null
        ) {

            endOffset =
                    item.getContentEndOffset();

        } else if (
                item.getEpisode() != null
        ) {

            endOffset =
                    item.getEpisode()
                            .getDurationMinutes() * 60;

        } else {

            endOffset =
                    item.getMediaContent()
                            .getDurationSeconds();
        }


        return endOffset - startOffset;
    }
// =================================================
// ACTUALIZAR SCHEDULE EXISTENTE
// =================================================

    private void actualizarScheduleDesdeItem(
            Schedule schedule,
            ProgrammingBlockItem item,
            ProgrammingBlock block,
            LocalDate airDate,
            LocalTime startTime,
            LocalTime endTime) {

        schedule.setProgrammingBlock(
                block
        );


        schedule.setAirDate(
                airDate
        );


        schedule.setStartTime(
                startTime
        );


        schedule.setEndTime(
                endTime
        );


        int startOffset =
                item.getContentStartOffset();


        int duration =
                calcularDuracionItem(
                        item
                );


        int endOffset =
                startOffset +
                        duration;


        schedule.setContentStartOffset(
                startOffset
        );


        schedule.setContentEndOffset(
                endOffset
        );

        schedule.setActive(
                true
        );


        // =============================================
        // EPISODIO
        // =============================================

        if (
                item.getEpisode() != null
        ) {

            schedule.setEpisode(
                    item.getEpisode()
            );


            schedule.setMediaContent(
                    null
            );

        } else {

            // =========================================
            // MEDIA CONTENT
            // =========================================

            schedule.setMediaContent(
                    item.getMediaContent()
            );


            schedule.setEpisode(
                    null
            );
        }


        scheduleRepository.save(
                schedule
        );
    }

    // =================================================
   // CREAR NUEVO SCHEDULE
   // =================================================

    private Schedule crearScheduleDesdeItem(
            ProgrammingBlockItem item,
            ProgrammingBlock block,
            LocalDate airDate,
            LocalTime startTime,
            LocalTime endTime) {

        Schedule schedule =
                new Schedule();


        schedule.setAirDate(
                airDate
        );


        schedule.setStartTime(
                startTime
        );


        schedule.setEndTime(
                endTime
        );


        schedule.setActive(
                true
        );


        schedule.setProgrammingBlock(
                block
        );


        int startOffset =
                item.getContentStartOffset();


        int duration =
                calcularDuracionItem(
                        item
                );


        int endOffset =
                startOffset +
                        duration;


        schedule.setContentStartOffset(
                startOffset
        );


        schedule.setContentEndOffset(
                endOffset
        );


        // =============================================
        // EPISODIO
        // =============================================

        if (
                item.getEpisode() != null
        ) {

            schedule.setEpisode(
                    item.getEpisode()
            );


            schedule.setMediaContent(
                    null
            );


            return schedule;
        }


        // =============================================
        // MEDIA CONTENT
        // =============================================

        schedule.setMediaContent(
                item.getMediaContent()
        );


        schedule.setEpisode(
                null
        );


        return schedule;
    }




    // =================================================
    // ELIMINAR
    // =================================================

    // =================================================
// ELIMINAR BLOQUE
// =================================================

    @Override
    @Transactional
    public void deleteById(
            Long id) {

        // =============================================
        // BUSCAR BLOQUE
        // =============================================

        ProgrammingBlock block =
                programmingBlockRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bloque de programación no encontrado."
                                )
                        );


        // =============================================
        // DESVINCULAR PROGRAMACIONES GENERADAS
        // =============================================

        List<Schedule> schedules =
                scheduleRepository
                        .findByProgrammingBlockIdOrderByAirDateAscStartTimeAsc(
                                id
                        );


        for (
                Schedule schedule :
                schedules
        ) {

            schedule.setProgrammingBlock(
                    null
            );
        }


        if (
                !schedules.isEmpty()
        ) {

            scheduleRepository.saveAll(
                    schedules
            );
        }


        // =============================================
        // ELIMINAR ITEMS DEL BLOQUE
        // =============================================

        List<ProgrammingBlockItem> items =
                programmingBlockItemRepository
                        .findByProgrammingBlockIdOrderByPositionAsc(
                                id
                        );


        programmingBlockItemRepository.deleteAll(
                items
        );


        // =============================================
        // FORZAR ELIMINACIÓN DE ITEMS
        // =============================================

        programmingBlockItemRepository.flush();


        // =============================================
        // ELIMINAR BLOQUE
        // =============================================

        programmingBlockRepository.delete(
                block
        );
    }


    // =================================================
    // VALIDAR ITEMS
    // =================================================

    private void validarItems(
            List<ProgrammingBlockItemRequestDTO> items) {

        if (
                items == null ||
                        items.isEmpty()
        ) {

            throw new ResourceConflictException(
                    "El bloque debe contener al menos un elemento."
            );
        }


        Set<Integer> positions =
                new HashSet<>();


        for (
                ProgrammingBlockItemRequestDTO item :
                items
        ) {

            // =========================================
            // POSICIÓN ÚNICA
            // =========================================

            if (
                    !positions.add(
                            item.getPosition()
                    )
            ) {

                throw new ResourceConflictException(
                        "No puede haber dos elementos " +
                                "con la misma posición."
                );
            }


            // =========================================
            // CONTENIDO
            // =========================================

            boolean hasEpisode =
                    item.getEpisodeId() != null;

            boolean hasMediaContent =
                    item.getMediaContentId() != null;


            if (
                    hasEpisode &&
                            hasMediaContent
            ) {

                throw new ResourceConflictException(
                        "Un elemento del bloque no puede " +
                                "tener un episodio y contenido " +
                                "multimedia al mismo tiempo."
                );
            }


            if (
                    !hasEpisode &&
                            !hasMediaContent
            ) {

                throw new ResourceConflictException(
                        "Cada elemento del bloque debe tener " +
                                "un episodio o contenido multimedia."
                );
            }


            // =========================================
            // OFFSETS
            // =========================================

            if (
                    item.getContentStartOffset() != null &&
                            item.getContentStartOffset() < 0
            ) {

                throw new ResourceConflictException(
                        "El inicio del contenido no puede ser negativo."
                );
            }


            if (
                    item.getContentEndOffset() != null &&
                            item.getContentEndOffset() < 1
            ) {

                throw new ResourceConflictException(
                        "El final del contenido debe ser mayor que cero."
                );
            }


            if (
                    item.getContentStartOffset() != null &&
                            item.getContentEndOffset() != null &&
                            item.getContentEndOffset()
                                    <= item.getContentStartOffset()
            ) {

                throw new ResourceConflictException(
                        "El final del fragmento debe ser mayor " +
                                "que el inicio."
                );
            }


            // =========================================
            // VALIDAR EXISTENCIA DEL CONTENIDO
            // =========================================

            if (hasEpisode) {

                Episode episode =
                        episodeRepository
                                .findById(
                                        item.getEpisodeId()
                                )
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "El episodio indicado en " +
                                                        "el bloque no existe."
                                        )
                                );


                validarOffsetsContraDuracion(
                        item,
                        episode.getDurationMinutes() * 60
                );
            }


            if (hasMediaContent) {

                MediaContent mediaContent =
                        mediaContentRepository
                                .findById(
                                        item.getMediaContentId()
                                )
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "El contenido multimedia " +
                                                        "indicado en el bloque no existe."
                                        )
                                );


                validarOffsetsContraDuracion(
                        item,
                        mediaContent.getDurationSeconds()
                );
            }
        }
    }


    // =================================================
    // VALIDAR OFFSETS CONTRA DURACIÓN
    // =================================================

    private void validarOffsetsContraDuracion(
            ProgrammingBlockItemRequestDTO item,
            int totalDurationSeconds) {

        int startOffset =
                item.getContentStartOffset() == null
                        ? 0
                        : item.getContentStartOffset();


        int endOffset =
                item.getContentEndOffset() == null
                        ? totalDurationSeconds
                        : item.getContentEndOffset();


        if (
                startOffset >=
                        totalDurationSeconds
        ) {

            throw new ResourceConflictException(
                    "El inicio del fragmento está fuera " +
                            "de la duración del contenido."
            );
        }


        if (
                endOffset >
                        totalDurationSeconds
        ) {

            throw new ResourceConflictException(
                    "El final del fragmento supera " +
                            "la duración del contenido."
            );
        }


        if (
                endOffset <=
                        startOffset
        ) {

            throw new ResourceConflictException(
                    "El fragmento debe tener una duración mayor que cero."
            );
        }
    }


    // =================================================
    // GUARDAR ITEMS
    // =================================================

    private void guardarItems(
            ProgrammingBlock block,
            List<ProgrammingBlockItemRequestDTO> items) {

        for (
                ProgrammingBlockItemRequestDTO request :
                items
        ) {

            ProgrammingBlockItem item =
                    new ProgrammingBlockItem();


            item.setProgrammingBlock(
                    block
            );


            item.setPosition(
                    request.getPosition()
            );


            int startOffset =
                    request.getContentStartOffset() == null
                            ? 0
                            : request.getContentStartOffset();


            item.setContentStartOffset(
                    startOffset
            );


            if (
                    request.getContentEndOffset() != null
            ) {

                item.setContentEndOffset(
                        request.getContentEndOffset()
                );
            }


            // =========================================
            // EPISODIO
            // =========================================

            if (
                    request.getEpisodeId() != null
            ) {

                Episode episode =
                        episodeRepository
                                .findById(
                                        request.getEpisodeId()
                                )
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Episodio no encontrado."
                                        )
                                );


                item.setEpisode(
                        episode
                );


                item.setMediaContent(
                        null
                );
            }


            // =========================================
            // MEDIA CONTENT
            // =========================================

            else {

                MediaContent mediaContent =
                        mediaContentRepository
                                .findById(
                                        request.getMediaContentId()
                                )
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Contenido multimedia no encontrado."
                                        )
                                );


                item.setMediaContent(
                        mediaContent
                );


                item.setEpisode(
                        null
                );
            }


            programmingBlockItemRepository.save(
                    item
            );
        }
    }


    // =================================================
    // CONVERTIR BLOQUE A DTO
    // =================================================

    private ProgrammingBlockResponseDTO toResponseDTO(
            ProgrammingBlock block) {

        ProgrammingBlockResponseDTO response =
                new ProgrammingBlockResponseDTO();


        response.setId(
                block.getId()
        );


        response.setName(
                block.getName()
        );


        response.setDescription(
                block.getDescription()
        );


        response.setActive(
                block.getActive()
        );


        List<ProgrammingBlockItem> items =
                programmingBlockItemRepository
                        .findByProgrammingBlockIdOrderByPositionAsc(
                                block.getId()
                        );


        List<ProgrammingBlockItemResponseDTO> itemResponses =
                items.stream()
                        .map(this::toItemResponseDTO)
                        .toList();


        response.setItems(
                itemResponses
        );


        response.setTotalDurationSeconds(
                calcularDuracionTotal(
                        items
                )
        );


        return response;
    }


    // =================================================
    // CONVERTIR ITEM A DTO
    // =================================================

    private ProgrammingBlockItemResponseDTO
    toItemResponseDTO(
            ProgrammingBlockItem item) {

        ProgrammingBlockItemResponseDTO response =
                new ProgrammingBlockItemResponseDTO();


        response.setId(
                item.getId()
        );


        response.setPosition(
                item.getPosition()
        );


        response.setContentStartOffset(
                item.getContentStartOffset()
        );


        response.setContentEndOffset(
                item.getContentEndOffset()
        );


        // =================================================
        // EPISODIO
        // =================================================

        if (
                item.getEpisode() != null
        ) {

            Episode episode =
                    item.getEpisode();


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


            if (
                    episode.getSeason() != null
            ) {

                response.setSeasonTitle(
                        episode
                                .getSeason()
                                .getTitle()
                );


                if (
                        episode
                                .getSeason()
                                .getSeries() != null
                ) {

                    response.setSeriesTitle(
                            episode
                                    .getSeason()
                                    .getSeries()
                                    .getTitle()
                    );
                }
            }
        }


        // =================================================
        // MEDIA CONTENT
        // =================================================

        else if (
                item.getMediaContent() != null
        ) {

            MediaContent mediaContent =
                    item.getMediaContent();


            response.setContentType(
                    "MEDIA_CONTENT"
            );


            response.setMediaContentId(
                    mediaContent.getId()
            );


            response.setMediaContentTitle(
                    mediaContent.getTitle()
            );


            response.setMediaContentType(
                    mediaContent.getType()
                            .name()
            );


            response.setMediaContentDescription(
                    mediaContent.getDescription()
            );
        }


        // =================================================
        // DURACIÓN DEL ITEM
        // =================================================

        int startOffset =
                item.getContentStartOffset();


        int endOffset;


        if (
                item.getContentEndOffset() != null
        ) {

            endOffset =
                    item.getContentEndOffset();

        } else if (
                item.getEpisode() != null
        ) {

            endOffset =
                    item.getEpisode()
                            .getDurationMinutes() * 60;

        } else {

            endOffset =
                    item.getMediaContent()
                            .getDurationSeconds();
        }


        response.setDurationSeconds(
                endOffset - startOffset
        );


        return response;
    }


    // =================================================
    // DURACIÓN TOTAL DEL BLOQUE
    // =================================================

    private int calcularDuracionTotal(
            List<ProgrammingBlockItem> items) {

        int total =
                0;


        for (
                ProgrammingBlockItem item :
                items
        ) {

            int startOffset =
                    item.getContentStartOffset();


            int endOffset;


            if (
                    item.getContentEndOffset() != null
            ) {

                endOffset =
                        item.getContentEndOffset();

            } else if (
                    item.getEpisode() != null
            ) {

                endOffset =
                        item.getEpisode()
                                .getDurationMinutes() * 60;

            } else {

                endOffset =
                        item.getMediaContent()
                                .getDurationSeconds();
            }


            total +=
                    endOffset -
                            startOffset;
        }


        return total;
    }
    // =================================================
// OBTENER PROGRAMACIÓN DEL BLOQUE
// =================================================

    @Override
    @Transactional
    public List<ScheduleResponseDTO> findSchedules(
            Long id) {

        // =============================================
        // VERIFICAR QUE EL BLOQUE EXISTA
        // =============================================

        programmingBlockRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Bloque de programación no encontrado."
                        )
                );


        // =============================================
        // BUSCAR PROGRAMACIÓN GENERADA
        // =============================================

        List<Schedule> schedules =
                scheduleRepository
                        .findByProgrammingBlockIdOrderByAirDateAscStartTimeAsc(
                                id
                        );


        // =============================================
        // CONVERTIR A DTO
        // =============================================

        return schedules
                .stream()
                .map(this::toScheduleResponseDTO)
                .toList();
    }

    // =================================================
   // CONVERTIR SCHEDULE A DTO
   // =================================================

    private ScheduleResponseDTO toScheduleResponseDTO(
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

            var episode =
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

            response.setVideoUrl(
                    episode.getVideoUrl()
            );


            if (episode.getSeason() != null) {

                response.setSeasonTitle(
                        episode.getSeason().getTitle()
                );


                if (episode.getSeason().getSeries() != null) {

                    response.setSeriesTitle(
                            episode
                                    .getSeason()
                                    .getSeries()
                                    .getTitle()
                    );
                }
            }

            return response;
        }


        // =============================================
        // MEDIA CONTENT
        // =============================================

        if (schedule.getMediaContent() != null) {

            var mediaContent =
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
