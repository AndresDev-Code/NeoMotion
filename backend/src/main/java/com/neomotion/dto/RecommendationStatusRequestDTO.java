package com.neomotion.dto;

import com.neomotion.entity.RecommendationStatus;
import jakarta.validation.constraints.NotNull;

public class RecommendationStatusRequestDTO {

    @NotNull
    private RecommendationStatus status;


    public RecommendationStatusRequestDTO() {
    }


    public RecommendationStatus getStatus() {
        return status;
    }

    public void setStatus(
            RecommendationStatus status) {

        this.status = status;
    }
}
