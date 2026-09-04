package com.neomotion.repository;

import com.neomotion.entity.ProgrammingBlock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgrammingBlockRepository
        extends JpaRepository<ProgrammingBlock, Long> {

    // =================================================
    // BLOQUES ACTIVOS
    // =================================================

    List<ProgrammingBlock> findByActiveTrueOrderByNameAsc();
}