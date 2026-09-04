package com.neomotion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
        name = "programming_block_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "programming_block_id",
                                "position"
                        }
                )
        }
)
public class ProgrammingBlockItem extends BaseEntity {

    // =================================================
    // BLOQUE
    // =================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "programming_block_id",
            nullable = false
    )
    private ProgrammingBlock programmingBlock;


    // =================================================
    // POSICIÓN DENTRO DEL BLOQUE
    // =================================================

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer position;


    // =================================================
    // EPISODIO
    // =================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "episode_id")
    private Episode episode;


    // =================================================
    // CONTENIDO MULTIMEDIA
    // =================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_content_id")
    private MediaContent mediaContent;


    // =================================================
    // FRAGMENTO DEL CONTENIDO
    // =================================================

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer contentStartOffset = 0;


    @Min(1)
    private Integer contentEndOffset;


    public ProgrammingBlockItem() {
    }


    // =================================================
    // PROGRAMMING BLOCK
    // =================================================

    public ProgrammingBlock getProgrammingBlock() {
        return programmingBlock;
    }

    public void setProgrammingBlock(
            ProgrammingBlock programmingBlock) {

        this.programmingBlock =
                programmingBlock;
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
    // EPISODE
    // =================================================

    public Episode getEpisode() {
        return episode;
    }

    public void setEpisode(
            Episode episode) {

        this.episode =
                episode;
    }


    // =================================================
    // MEDIA CONTENT
    // =================================================

    public MediaContent getMediaContent() {
        return mediaContent;
    }

    public void setMediaContent(
            MediaContent mediaContent) {

        this.mediaContent =
                mediaContent;
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