package com.neomotion.dto;

import com.neomotion.entity.MediaContentType;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleResponseDTO {

    private Long id;

    private LocalDate airDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Boolean active;


    // =========================
    // FRAGMENTO DEL CONTENIDO
    // =========================

    private Integer contentStartOffset;

    private Integer contentEndOffset;


    // =========================
    // TIPO DE CONTENIDO
    // =========================

    private String contentType;


    // =========================
    // EPISODIO
    // =========================

    private Long episodeId;

    private String episodeTitle;

    private Integer episodeNumber;

    private String seasonTitle;

    private String seriesTitle;


    // =========================
    // CONTENIDO MULTIMEDIA
    // =========================

    private Long mediaContentId;

    private String mediaContentTitle;

    private String mediaContentDescription;

    private MediaContentType mediaContentType;


    // =========================
    // VIDEO
    // =========================

    private String videoUrl;

    // =========================
   // BLOQUE DE PROGRAMACIÓN
  // =========================

    private Long programmingBlockId;

    private String programmingBlockName;


    // =========================
    // ID
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {

        this.id = id;
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
    // ACTIVE
    // =========================

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
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
    // CONTENT TYPE
    // =========================

    public String getContentType() {
        return contentType;
    }

    public void setContentType(
            String contentType) {

        this.contentType = contentType;
    }


    // =========================
    // EPISODE ID
    // =========================

    public Long getEpisodeId() {
        return episodeId;
    }

    public void setEpisodeId(
            Long episodeId) {

        this.episodeId = episodeId;
    }


    // =========================
    // EPISODE TITLE
    // =========================

    public String getEpisodeTitle() {
        return episodeTitle;
    }

    public void setEpisodeTitle(
            String episodeTitle) {

        this.episodeTitle = episodeTitle;
    }


    // =========================
    // EPISODE NUMBER
    // =========================

    public Integer getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(
            Integer episodeNumber) {

        this.episodeNumber =
                episodeNumber;
    }


    // =========================
    // SEASON TITLE
    // =========================

    public String getSeasonTitle() {
        return seasonTitle;
    }

    public void setSeasonTitle(
            String seasonTitle) {

        this.seasonTitle =
                seasonTitle;
    }


    // =========================
    // SERIES TITLE
    // =========================

    public String getSeriesTitle() {
        return seriesTitle;
    }

    public void setSeriesTitle(
            String seriesTitle) {

        this.seriesTitle =
                seriesTitle;
    }


    // =========================
    // MEDIA CONTENT ID
    // =========================

    public Long getMediaContentId() {
        return mediaContentId;
    }

    public void setMediaContentId(
            Long mediaContentId) {

        this.mediaContentId =
                mediaContentId;
    }


    // =========================
    // MEDIA CONTENT TITLE
    // =========================

    public String getMediaContentTitle() {
        return mediaContentTitle;
    }

    public void setMediaContentTitle(
            String mediaContentTitle) {

        this.mediaContentTitle =
                mediaContentTitle;
    }


    // =========================
    // MEDIA CONTENT DESCRIPTION
    // =========================

    public String getMediaContentDescription() {
        return mediaContentDescription;
    }

    public void setMediaContentDescription(
            String mediaContentDescription) {

        this.mediaContentDescription =
                mediaContentDescription;
    }


    // =========================
    // MEDIA CONTENT TYPE
    // =========================

    public MediaContentType getMediaContentType() {
        return mediaContentType;
    }

    public void setMediaContentType(
            MediaContentType mediaContentType) {

        this.mediaContentType =
                mediaContentType;
    }


    // =========================
    // VIDEO URL
    // =========================

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(
            String videoUrl) {

        this.videoUrl = videoUrl;
    }

    // =========================
// PROGRAMMING BLOCK ID
// =========================

    public Long getProgrammingBlockId() {
        return programmingBlockId;
    }

    public void setProgrammingBlockId(
            Long programmingBlockId) {

        this.programmingBlockId =
                programmingBlockId;
    }


// =========================
// PROGRAMMING BLOCK NAME
// =========================

    public String getProgrammingBlockName() {
        return programmingBlockName;
    }

    public void setProgrammingBlockName(
            String programmingBlockName) {

        this.programmingBlockName =
                programmingBlockName;
    }
}