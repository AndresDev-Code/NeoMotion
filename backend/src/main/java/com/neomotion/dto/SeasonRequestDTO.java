package com.neomotion.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SeasonRequestDTO {

    @NotNull
    @Min(1)
    private Integer seasonNumber;

    private String title;

    private String description;

    @NotNull
    private Long seriesId;

    // Getters y Setters


    public Integer getSeasonNumber() {
        return seasonNumber;
    }

    public void setSeasonNumber(Integer seasonNumber) {
        this.seasonNumber = seasonNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSeriesId() {
        return seriesId;
    }

    public void setSeriesId(Long seriesId) {
        this.seriesId = seriesId;
    }
}