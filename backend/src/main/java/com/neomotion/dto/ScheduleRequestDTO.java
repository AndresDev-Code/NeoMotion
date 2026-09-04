package com.neomotion.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleRequestDTO {

    // =========================
    // FECHA DE TRANSMISIÓN
    // =========================

    @NotNull
    private LocalDate airDate;


    // =========================
    // HORA DE INICIO
    // =========================

    private LocalTime startTime;


    // =========================
    // OFFSET DEL CONTENIDO
    // =========================

    /*
     * Segundo exacto desde donde comienza
     * el fragmento del contenido.
     *
     * Ejemplo:
     * 0 = desde el inicio
     * 900 = desde el segundo 900
     */
    private Integer contentStartOffset;


    /*
     * Segundo exacto donde termina
     * el fragmento del contenido.
     *
     * Ejemplo:
     * 1440 = hasta el segundo 1440
     *
     * Si es null, el backend utilizará
     * la duración total del contenido.
     */
    private Integer contentEndOffset;


    // =========================
    // CONTENIDO
    // =========================

    /*
     * Solo uno de estos dos campos
     * debe tener valor.
     */

    private Long episodeId;

    private Long mediaContentId;


    // =========================
    // GETTERS Y SETTERS
    // =========================

    public LocalDate getAirDate() {
        return airDate;
    }

    public void setAirDate(LocalDate airDate) {

        this.airDate = airDate;
    }


    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {

        this.startTime = startTime;
    }


    // =========================
    // CONTENT START OFFSET
    // =========================

    public Integer getContentStartOffset() {
        return contentStartOffset;
    }

    public void setContentStartOffset(
            Integer contentStartOffset) {

        this.contentStartOffset =
                contentStartOffset;
    }


    // =========================
    // CONTENT END OFFSET
    // =========================

    public Integer getContentEndOffset() {
        return contentEndOffset;
    }

    public void setContentEndOffset(
            Integer contentEndOffset) {

        this.contentEndOffset =
                contentEndOffset;
    }


    // =========================
    // EPISODE
    // =========================

    public Long getEpisodeId() {
        return episodeId;
    }

    public void setEpisodeId(
            Long episodeId) {

        this.episodeId = episodeId;
    }


    // =========================
    // MEDIA CONTENT
    // =========================

    public Long getMediaContentId() {
        return mediaContentId;
    }

    public void setMediaContentId(
            Long mediaContentId) {

        this.mediaContentId =
                mediaContentId;
    }
}