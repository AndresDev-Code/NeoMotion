package com.neomotion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "programming_blocks")
public class ProgrammingBlock extends BaseEntity {

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;


    @Column(length = 1000)
    private String description;


    @Column(nullable = false)
    private Boolean active = true;


    public ProgrammingBlock() {
    }


    // =================================================
    // NAME
    // =================================================

    public String getName() {
        return name;
    }

    public void setName(
            String name) {

        this.name = name;
    }


    // =================================================
    // DESCRIPTION
    // =================================================

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description) {

        this.description = description;
    }


    // =================================================
    // ACTIVE
    // =================================================

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
    }
}