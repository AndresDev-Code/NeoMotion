package com.neomotion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RecommendationRequestDTO {

    @NotBlank
    @Size(max = 200)
    private String title;

    @Size(max = 1000)
    private String reason;


    public RecommendationRequestDTO() {
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
}