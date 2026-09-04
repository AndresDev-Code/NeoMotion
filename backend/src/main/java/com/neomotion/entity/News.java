package com.neomotion.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    @Column(
            nullable = false,
            length = 150
    )
    private String title;


    @Column(
            nullable = false,
            length = 80
    )
    private String category;


    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String content;


    @Column(
            length = 500
    )
    private String imageUrl;


    @Column(
            nullable = false
    )
    private LocalDateTime publishedAt;


    @Column(
            nullable = false
    )
    private Boolean active = true;


    public News() {
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