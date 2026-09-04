package com.neomotion.dto;

import java.util.List;

public class ProgrammingBlockResponseDTO {

    private Long id;

    private String name;

    private String description;

    private Boolean active;

    private Integer totalDurationSeconds;

    private List<ProgrammingBlockItemResponseDTO> items;


    // =================================================
    // ID
    // =================================================

    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {

        this.id =
                id;
    }


    // =================================================
    // NAME
    // =================================================

    public String getName() {
        return name;
    }

    public void setName(
            String name) {

        this.name =
                name;
    }


    // =================================================
    // DESCRIPTION
    // =================================================

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description) {

        this.description =
                description;
    }


    // =================================================
    // ACTIVE
    // =================================================

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active =
                active;
    }


    // =================================================
    // TOTAL DURATION
    // =================================================

    public Integer getTotalDurationSeconds() {
        return totalDurationSeconds;
    }

    public void setTotalDurationSeconds(
            Integer totalDurationSeconds) {

        this.totalDurationSeconds =
                totalDurationSeconds;
    }


    // =================================================
    // ITEMS
    // =================================================

    public List<ProgrammingBlockItemResponseDTO> getItems() {
        return items;
    }

    public void setItems(
            List<ProgrammingBlockItemResponseDTO> items) {

        this.items =
                items;
    }
}