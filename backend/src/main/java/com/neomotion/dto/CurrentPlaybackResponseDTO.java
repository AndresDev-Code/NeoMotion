package com.neomotion.dto;

public class CurrentPlaybackResponseDTO {

    private Long scheduleId;

    private String contentType;

    private String title;

    private String videoUrl;

    private Integer playbackStartSeconds;

    private Integer playbackEndSeconds;


    // =============================================
    // SCHEDULE ID
    // =============================================

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(
            Long scheduleId) {

        this.scheduleId = scheduleId;
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

        this.videoUrl = videoUrl;
    }


    // =============================================
    // PLAYBACK START SECONDS
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
    // PLAYBACK END SECONDS
    // =============================================

    public Integer getPlaybackEndSeconds() {
        return playbackEndSeconds;
    }

    public void setPlaybackEndSeconds(
            Integer playbackEndSeconds) {

        this.playbackEndSeconds =
                playbackEndSeconds;
    }
}