package com.neomotion.dto;

import java.time.LocalDateTime;

public class FavoriteResponseDTO {

    private Long id;

    private Long seriesId;

    private String seriesTitle;

    private String seriesDescription;

    private String imageUrl;

    private LocalDateTime createdAt;

    public FavoriteResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSeriesId() {
        return seriesId;
    }

    public void setSeriesId(Long seriesId) {
        this.seriesId = seriesId;
    }

    public String getSeriesTitle() {
        return seriesTitle;
    }

    public void setSeriesTitle(
            String seriesTitle) {
        this.seriesTitle = seriesTitle;
    }

    public String getSeriesDescription() {
        return seriesDescription;
    }

    public void setSeriesDescription(
            String seriesDescription) {
        this.seriesDescription =
                seriesDescription;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(
            String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}