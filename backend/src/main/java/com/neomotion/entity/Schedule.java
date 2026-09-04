package com.neomotion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
public class Schedule extends BaseEntity {

    @NotNull
    private LocalDate airDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;


    // =========================
    // OFFSET DEL CONTENIDO
    // =========================

    @NotNull
    private Integer contentStartOffset = 0;

    @NotNull
    private Integer contentEndOffset;


    // =========================
    // EPISODIO
    // =========================

    @ManyToOne
    @JoinColumn(name = "episode_id")
    private Episode episode;


    // =========================
    // CONTENIDO MULTIMEDIA
    // =========================

    @ManyToOne
    @JoinColumn(name = "media_content_id")
    private MediaContent mediaContent;


    public Schedule() {
    }


    // =========================
    // AIR DATE
    // =========================

    public LocalDate getAirDate() {
        return airDate;
    }

    public void setAirDate(
            LocalDate airDate) {

        this.airDate = airDate;
    }


    // =========================
    // START TIME
    // =========================

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(
            LocalTime startTime) {

        this.startTime = startTime;
    }


    // =========================
    // END TIME
    // =========================

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(
            LocalTime endTime) {

        this.endTime = endTime;
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

    public Episode getEpisode() {
        return episode;
    }

    public void setEpisode(
            Episode episode) {

        this.episode = episode;
    }


    // =========================
    // MEDIA CONTENT
    // =========================

    public MediaContent getMediaContent() {
        return mediaContent;
    }

    public void setMediaContent(
            MediaContent mediaContent) {

        this.mediaContent = mediaContent;
    }

    // =================================================
    // BLOQUE DE PROGRAMACIÓN DE ORIGEN
    // =================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programming_block_id")
    private ProgrammingBlock programmingBlock;

    public ProgrammingBlock getProgrammingBlock() {
        return programmingBlock;
    }

    public void setProgrammingBlock(
            ProgrammingBlock programmingBlock) {

        this.programmingBlock =
                programmingBlock;
    }

}