package com.neomotion.dto;

import com.neomotion.entity.RecommendationStatus;

import java.time.LocalDateTime;

public class RecommendationResponseDTO {

    private Long id;

    private Long userId;

    private String username;

    private String title;

    private String reason;

    private RecommendationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public RecommendationResponseDTO() {
    }


    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {

        this.id = id;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(
            Long userId) {

        this.userId = userId;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(
            String username) {

        this.username = username;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(
            String title) {

        this.title = title;
    }


    public String getReason() {
        return reason;
    }

    public void setReason(
            String reason) {

        this.reason = reason;
    }


    public RecommendationStatus getStatus() {
        return status;
    }

    public void setStatus(
            RecommendationStatus status) {

        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }
}