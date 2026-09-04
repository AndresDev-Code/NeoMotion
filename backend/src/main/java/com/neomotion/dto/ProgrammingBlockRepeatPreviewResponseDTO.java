package com.neomotion.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ProgrammingBlockRepeatPreviewResponseDTO {

    // =================================================
    // BLOQUE
    // =================================================

    private Long blockId;

    private String blockName;


    // =================================================
    // RANGO
    // =================================================

    private LocalDate startDate;

    private LocalDate endDate;

    private LocalTime startTime;


    // =================================================
    // RESUMEN
    // =================================================

    private Integer totalOccurrences;

    private Integer totalSchedules;

    private Integer totalDurationSeconds;


    // =================================================
    // CONFLICTOS
    // =================================================

    private Boolean hasConflicts;


    // =================================================
    // OCURRENCIAS
    // =================================================

    private List<ProgrammingBlockRepeatPreviewItemDTO>
            occurrences;


    // =================================================
    // GETTERS Y SETTERS
    // =================================================

    public Long getBlockId() {
        return blockId;
    }

    public void setBlockId(
            Long blockId) {

        this.blockId = blockId;
    }


    public String getBlockName() {
        return blockName;
    }

    public void setBlockName(
            String blockName) {

        this.blockName = blockName;
    }


    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(
            LocalDate startDate) {

        this.startDate = startDate;
    }


    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(
            LocalDate endDate) {

        this.endDate = endDate;
    }


    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(
            LocalTime startTime) {

        this.startTime = startTime;
    }


    public Integer getTotalOccurrences() {
        return totalOccurrences;
    }

    public void setTotalOccurrences(
            Integer totalOccurrences) {

        this.totalOccurrences =
                totalOccurrences;
    }


    public Integer getTotalSchedules() {
        return totalSchedules;
    }

    public void setTotalSchedules(
            Integer totalSchedules) {

        this.totalSchedules =
                totalSchedules;
    }


    public Integer getTotalDurationSeconds() {
        return totalDurationSeconds;
    }

    public void setTotalDurationSeconds(
            Integer totalDurationSeconds) {

        this.totalDurationSeconds =
                totalDurationSeconds;
    }


    public Boolean getHasConflicts() {
        return hasConflicts;
    }

    public void setHasConflicts(
            Boolean hasConflicts) {

        this.hasConflicts =
                hasConflicts;
    }


    public List<ProgrammingBlockRepeatPreviewItemDTO>
    getOccurrences() {

        return occurrences;
    }

    public void setOccurrences(
            List<ProgrammingBlockRepeatPreviewItemDTO>
                    occurrences) {

        this.occurrences =
                occurrences;
    }
}