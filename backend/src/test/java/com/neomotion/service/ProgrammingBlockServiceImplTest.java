package com.neomotion.service;

import com.neomotion.dto.ProgrammingBlockItemRequestDTO;
import com.neomotion.dto.ProgrammingBlockRequestDTO;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.repository.EpisodeRepository;
import com.neomotion.repository.MediaContentRepository;
import com.neomotion.repository.ProgrammingBlockItemRepository;
import com.neomotion.repository.ProgrammingBlockRepository;
import com.neomotion.repository.ScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class ProgrammingBlockServiceImplTest {

    @Mock
    private ProgrammingBlockRepository programmingBlockRepository;

    @Mock
    private ProgrammingBlockItemRepository programmingBlockItemRepository;

    @Mock
    private EpisodeRepository episodeRepository;

    @Mock
    private MediaContentRepository mediaContentRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    private ProgrammingBlockServiceImpl programmingBlockService;

    @BeforeEach
    void setUp() {
        programmingBlockService =
                new ProgrammingBlockServiceImpl(
                        programmingBlockRepository,
                        programmingBlockItemRepository,
                        episodeRepository,
                        mediaContentRepository,
                        scheduleRepository
                );
    }

    @Test
    void saveShouldRejectBlockWithoutItems() {

        ProgrammingBlockRequestDTO request =
                new ProgrammingBlockRequestDTO();

        request.setName("Bloque de prueba");
        request.setDescription("Descripción de prueba");
        request.setItems(List.of());

        assertThrows(
                ResourceConflictException.class,
                () -> programmingBlockService.save(request)
        );
    }

    @Test
    void saveShouldRejectItemWithEpisodeAndMediaContent() {

        ProgrammingBlockItemRequestDTO item =
                new ProgrammingBlockItemRequestDTO();

        item.setPosition(1);
        item.setEpisodeId(1L);
        item.setMediaContentId(1L);

        ProgrammingBlockRequestDTO request =
                new ProgrammingBlockRequestDTO();

        request.setName("Bloque de prueba");
        request.setDescription("Descripción de prueba");
        request.setItems(List.of(item));

        assertThrows(
                ResourceConflictException.class,
                () -> programmingBlockService.save(request)
        );
    }

    @Test
    void saveShouldRejectItemWithoutEpisodeOrMediaContent() {

        ProgrammingBlockItemRequestDTO item =
                new ProgrammingBlockItemRequestDTO();

        item.setPosition(1);

        ProgrammingBlockRequestDTO request =
                new ProgrammingBlockRequestDTO();

        request.setName("Bloque de prueba");
        request.setDescription("Descripción de prueba");
        request.setItems(List.of(item));

        assertThrows(
                ResourceConflictException.class,
                () -> programmingBlockService.save(request)
        );
    }
}