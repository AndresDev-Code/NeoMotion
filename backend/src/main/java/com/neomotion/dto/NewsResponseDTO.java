package com.neomotion.dto;

import java.time.LocalDateTime;

public class NewsResponseDTO {

    private Long id;

    private String title;

    private String category;

    private String content;

    private String imageUrl;

    private LocalDateTime publishedAt;

    private Boolean active;


    public NewsResponseDTO() {
    }


    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {
        this.id = id;
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