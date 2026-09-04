package com.neomotion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class NewsRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String category;

    @NotBlank
    private String content;

    private String imageUrl;

    @NotNull
    private LocalDateTime publishedAt;

    @NotNull
    private Boolean active;


    public NewsRequestDTO() {
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(
            String title) {
        this.title = title;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(
            String category) {
        this.category = category;
    }


    public String getContent() {
        return content;
    }

    public void setContent(
            String content) {
        this.content = content;
    }


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(
            String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(
            LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }


    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {
        this.active = active;
    }
}
