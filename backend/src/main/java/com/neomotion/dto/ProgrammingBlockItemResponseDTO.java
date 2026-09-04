package com.neomotion.dto;

public class ProgrammingBlockItemResponseDTO {

    private Long id;

    private Integer position;


    // =================================================
    // CONTENIDO
    // =================================================

    private String contentType;

    private Long episodeId;

    private String seriesTitle;

    private String seasonTitle;

    private Integer episodeNumber;

    private String episodeTitle;


    private Long mediaContentId;

    private String mediaContentTitle;

    private String mediaContentType;

    private String mediaContentDescription;


    // =================================================
    // FRAGMENTO
    // =================================================

    private Integer contentStartOffset;

    private Integer contentEndOffset;

    private Integer durationSeconds;


    // =================================================
    // ID
    // =================================================

    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {

        this.id =
                id;
    }


    // =================================================
    // POSITION
    // =================================================

    public Integer getPosition() {
        return position;
    }

    public void setPosition(
            Integer position) {

        this.position =
                position;
    }


    // =================================================
    // CONTENT TYPE
    // =================================================

    public String getContentType() {
        return contentType;
    }

    public void setContentType(
            String contentType) {

        this.contentType =
                contentType;
    }


    // =================================================
    // EPISODE ID
    // =================================================

    public Long getEpisodeId() {
        return episodeId;
    }

    public void setEpisodeId(
            Long episodeId) {

        this.episodeId =
                episodeId;
    }


    // =================================================
    // SERIES TITLE
    // =================================================

    public String getSeriesTitle() {
        return seriesTitle;
    }

    public void setSeriesTitle(
            String seriesTitle) {

        this.seriesTitle =
                seriesTitle;
    }


    // =================================================
    // SEASON TITLE
    // =================================================

    public String getSeasonTitle() {
        return seasonTitle;
    }

    public void setSeasonTitle(
            String seasonTitle) {

        this.seasonTitle =
                seasonTitle;
    }


    // =================================================
    // EPISODE NUMBER
    // =================================================

    public Integer getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(
            Integer episodeNumber) {

        this.episodeNumber =
                episodeNumber;
    }


    // =================================================
    // EPISODE TITLE
    // =================================================

    public String getEpisodeTitle() {
        return episodeTitle;
    }

    public void setEpisodeTitle(
            String episodeTitle) {

        this.episodeTitle =
                episodeTitle;
    }


    // =================================================
    // MEDIA CONTENT ID
    // =================================================

    public Long getMediaContentId() {
        return mediaContentId;
    }

    public void setMediaContentId(
            Long mediaContentId) {

        this.mediaContentId =
                mediaContentId;
    }


    // =================================================
    // MEDIA CONTENT TITLE
    // =================================================

    public String getMediaContentTitle() {
        return mediaContentTitle;
    }

    public void setMediaContentTitle(
            String mediaContentTitle) {

        this.mediaContentTitle =
                mediaContentTitle;
    }


    // =================================================
    // MEDIA CONTENT TYPE
    // =================================================

    public String getMediaContentType() {
        return mediaContentType;
    }

    public void setMediaContentType(
            String mediaContentType) {

        this.mediaContentType =
                mediaContentType;
    }


    // =================================================
    // MEDIA CONTENT DESCRIPTION
    // =================================================

    public String getMediaContentDescription() {
        return mediaContentDescription;
    }

    public void setMediaContentDescription(
            String mediaContentDescription) {

        this.mediaContentDescription =
                mediaContentDescription;
    }


    // =================================================
    // CONTENT START OFFSET
    // =================================================

    public Integer getContentStartOffset() {
        return contentStartOffset;
    }

    public void setContentStartOffset(
            Integer contentStartOffset) {

        this.contentStartOffset =
                contentStartOffset;
    }


    // =================================================
    // CONTENT END OFFSET
    // =================================================

    public Integer getContentEndOffset() {
        return contentEndOffset;
    }

    public void setContentEndOffset(
            Integer contentEndOffset) {

        this.contentEndOffset =
                contentEndOffset;
    }


    // =================================================
    // DURATION
    // =================================================

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(
            Integer durationSeconds) {

        this.durationSeconds =
                durationSeconds;
    }
}