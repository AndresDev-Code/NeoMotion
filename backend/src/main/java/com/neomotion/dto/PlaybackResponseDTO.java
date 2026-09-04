package com.neomotion.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class PlaybackResponseDTO {

    // =============================================
    // IDENTIFICACIÓN DE LA PROGRAMACIÓN
    // =============================================

    private Long scheduleId;


    // =============================================
    // FECHA Y HORARIO
    // =============================================

    private LocalDate airDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDateTime serverDateTime;


    // =============================================
    // INFORMACIÓN DEL CONTENIDO
    // =============================================

    private String contentType;

    private String title;

    private String videoUrl;


    // =============================================
    // FRAGMENTO PROGRAMADO
    // =============================================

    private Integer playbackStartSeconds;

    private Integer playbackEndSeconds;


    // =============================================
    // POSICIÓN ACTUAL
    // =============================================

    private Integer currentPlaybackSeconds;

    private Integer remainingSeconds;


    // =============================================
    // GETTERS Y SETTERS
    // =============================================

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(
            Long scheduleId) {

        this.scheduleId = scheduleId;
    }


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


    // =============================================
    // SERVER DATE TIME
    // =============================================

    public LocalDateTime getServerDateTime() {
        return serverDateTime;
    }

    public void setServerDateTime(
            LocalDateTime serverDateTime) {

        this.serverDateTime =
                serverDateTime;
    }


    // =============================================
    // CONTENT TYPE
    // =============================================

    public String getContentType() {
        return contentType;
    }

    public void setContentType(
            String contentType) {

        this.contentType = contentType;
    }


    // =============================================
    // TITLE
    // =============================================

    public String getTitle() {
        return title;
    }

    public void setTitle(
            String title) {

        this.title = title;
    }


    // =============================================
    // VIDEO URL
    // =============================================

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(
            String videoUrl) {

        this.videoUrl =
                videoUrl;
    }


    // =============================================
    // PLAYBACK START
    // =============================================

    public Integer getPlaybackStartSeconds() {
        return playbackStartSeconds;
    }

    public void setPlaybackStartSeconds(
            Integer playbackStartSeconds) {

        this.playbackStartSeconds =
                playbackStartSeconds;
    }


    // =============================================
    // PLAYBACK END
    // =============================================

    public Integer getPlaybackEndSeconds() {
        return playbackEndSeconds;
    }

    public void setPlaybackEndSeconds(
            Integer playbackEndSeconds) {

        this.playbackEndSeconds =
                playbackEndSeconds;
    }


    // =============================================
    // CURRENT PLAYBACK
    // =============================================

    public Integer getCurrentPlaybackSeconds() {
        return currentPlaybackSeconds;
    }

    public void setCurrentPlaybackSeconds(
            Integer currentPlaybackSeconds) {

        this.currentPlaybackSeconds =
                currentPlaybackSeconds;
    }


    // =============================================
    // REMAINING SECONDS
    // =============================================

    public Integer getRemainingSeconds() {
        return remainingSeconds;
    }

    public void setRemainingSeconds(
            Integer remainingSeconds) {

        this.remainingSeconds =
                remainingSeconds;
    }
}