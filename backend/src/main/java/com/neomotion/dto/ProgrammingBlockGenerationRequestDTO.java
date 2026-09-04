package com.neomotion.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class ProgrammingBlockGenerationRequestDTO {

    // =================================================
    // BLOQUE
    // =================================================

    @NotNull
    private Long blockId;


    // =================================================
    // FECHA
    // =================================================

    @NotNull
    private LocalDate airDate;


    // =================================================
    // HORA DE INICIO
    // =================================================

    @NotNull
    private LocalTime startTime;


    // =================================================
    // GETTERS Y SETTERS
    // =================================================

    public Long getBlockId() {
        return blockId;
    }

    public void setBlockId(
            Long blockId) {

        this.blockId =
                blockId;
    }


    public LocalDate getAirDate() {
        return airDate;
    }

    public void setAirDate(
            LocalDate airDate) {

        this.airDate =
                airDate;
    }


    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(
            LocalTime startTime) {

        this.startTime =
                startTime;
    }
}