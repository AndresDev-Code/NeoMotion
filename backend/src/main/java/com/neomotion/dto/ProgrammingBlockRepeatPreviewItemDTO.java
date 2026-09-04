package com.neomotion.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ProgrammingBlockRepeatPreviewItemDTO {

    // =================================================
    // FECHA
    // =================================================

    private LocalDate airDate;


    // =================================================
    // HORARIO
    // =================================================

    private LocalTime startTime;

    private LocalTime endTime;


    // =================================================
    // CANTIDAD
    // =================================================

    private Integer scheduleCount;


    // =================================================
    // CONFLICTO
    // =================================================

    private Boolean conflict;

    private List<String> conflictMessages;


    // =================================================
    // GETTERS Y SETTERS
    // =================================================

    public LocalDate getAirDate() {
        return airDate;
    }

    public void setAirDate(
            LocalDate airDate) {

        this.airDate = airDate;
    }


    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(
            LocalTime startTime) {

        this.startTime = startTime;
    }


    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(
            LocalTime endTime) {

        this.endTime = endTime;
    }


    public Integer getScheduleCount() {
        return scheduleCount;
    }

    public void setScheduleCount(
            Integer scheduleCount) {

        this.scheduleCount =
                scheduleCount;
    }


    public Boolean getConflict() {
        return conflict;
    }

    public void setConflict(
            Boolean conflict) {

        this.conflict = conflict;
    }


    public List<String> getConflictMessages() {
        return conflictMessages;
    }

    public void setConflictMessages(
            List<String> conflictMessages) {

        this.conflictMessages =
                conflictMessages;
    }
}