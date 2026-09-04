package com.neomotion.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ProgrammingBlockItemRequestDTO {

    // =================================================
    // POSICIÓN
    // =================================================

    @NotNull
    @Min(1)
    private Integer position;


    // =================================================
    // CONTENIDO
    // =================================================

    private Long episodeId;

    private Long mediaContentId;


    // =================================================
    // FRAGMENTO
    // =================================================

    @Min(0)
    private Integer contentStartOffset;

    @Min(1)
    private Integer contentEndOffset;


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
    // EPISODE
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
    // MEDIA CONTENT
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
}