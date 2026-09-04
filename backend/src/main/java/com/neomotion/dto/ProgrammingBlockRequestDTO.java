package com.neomotion.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class ProgrammingBlockRequestDTO {

    // =================================================
    // INFORMACIÓN DEL BLOQUE
    // =================================================

    @NotBlank
    @Size(max = 150)
    private String name;


    @Size(max = 1000)
    private String description;


    // =================================================
    // ELEMENTOS DEL BLOQUE
    // =================================================

    @NotEmpty
    @Valid
    private List<ProgrammingBlockItemRequestDTO> items;


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
    // ITEMS
    // =================================================

    public List<ProgrammingBlockItemRequestDTO> getItems() {
        return items;
    }

    public void setItems(
            List<ProgrammingBlockItemRequestDTO> items) {

        this.items =
                items;
    }
}
