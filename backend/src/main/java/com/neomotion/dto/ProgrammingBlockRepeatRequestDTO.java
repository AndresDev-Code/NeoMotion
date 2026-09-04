package com.neomotion.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ProgrammingBlockRepeatRequestDTO {

    // =================================================
    // BLOQUE
    // =================================================

    @NotNull
    private Long blockId;


    // =================================================
    // FECHA INICIAL
    // =================================================

    @NotNull
    private LocalDate startDate;


    // =================================================
    // FECHA FINAL
    // =================================================

    @NotNull
    private LocalDate endDate;


    // =================================================
    // HORA DE INICIO
    // =================================================

    @NotNull
    private LocalTime startTime;


    // =================================================
    // DÍAS DE LA SEMANA
    // =================================================

    @NotEmpty
    private List<DayOfWeek> daysOfWeek;


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


    public LocalDate getStartDate() {

        return startDate;
    }

    public void setStartDate(
            LocalDate startDate) {

        this.startDate =
                startDate;
    }


    public LocalDate getEndDate() {

        return endDate;
    }

    public void setEndDate(
            LocalDate endDate) {

        this.endDate =
                endDate;
    }


    public LocalTime getStartTime() {

        return startTime;
    }

    public void setStartTime(
            LocalTime startTime) {

        this.startTime =
                startTime;
    }


    public List<DayOfWeek> getDaysOfWeek() {

        return daysOfWeek;
    }

    public void setDaysOfWeek(
            List<DayOfWeek> daysOfWeek) {

        this.daysOfWeek =
                daysOfWeek;
    }
}