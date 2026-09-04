package com.neomotion.repository;

import com.neomotion.entity.ProgrammingBlockItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgrammingBlockItemRepository
        extends JpaRepository<ProgrammingBlockItem, Long> {

    // =================================================
    // ELEMENTOS DE UN BLOQUE
    // =================================================

    List<ProgrammingBlockItem>
    findByProgrammingBlockIdOrderByPositionAsc(
            Long programmingBlockId
    );
}