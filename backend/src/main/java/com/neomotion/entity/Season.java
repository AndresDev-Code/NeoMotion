package com.neomotion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "seasons")
public class Season extends BaseEntity {

    @NotNull
    @Min(1)
    private Integer seasonNumber;

    private String title;

    private String description;


    @ManyToOne
    @JoinColumn(name = "series_id", nullable = false)
    private Series series;

    public Season() {
    }

    public Season(Integer seasonNumber,
                  String title,
                  String description,
                  Series series) {

        this.seasonNumber = seasonNumber;
        this.title = title;
        this.description = description;
        this.series = series;
    }

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


    public Series getSeries() {
        return series;
    }

    public void setSeries(Series series) {
        this.series = series;
    }
}
