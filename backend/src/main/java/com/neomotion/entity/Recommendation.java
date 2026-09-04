package com.neomotion.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "recommendations"
)
public class Recommendation {

    // =================================================
    // ID
    // =================================================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    // =================================================
    // USUARIO
    // =================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


    // =================================================
    // TÍTULO RECOMENDADO
    // =================================================

    @Column(
            nullable = false,
            length = 200
    )
    private String title;


    // =================================================
    // MOTIVO
    // =================================================

    @Column(
            length = 1000
    )
    private String reason;


    // =================================================
    // ESTADO
    // =================================================

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    private RecommendationStatus status;


    // =================================================
    // FECHA DE CREACIÓN
    // =================================================

    @Column(
            nullable = false
    )
    private LocalDateTime createdAt;


    // =================================================
    // FECHA DE ACTUALIZACIÓN
    // =================================================

    @Column
    private LocalDateTime updatedAt;


    // =================================================
    // CONSTRUCTOR
    // =================================================

    public Recommendation() {
    }


    // =================================================
    // PRE-PERSIST
    // =================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;

        updatedAt = now;

        if (status == null) {

            status =
                    RecommendationStatus.PENDING;
        }
    }


    // =================================================
    // PRE-UPDATE
    // =================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }


    // =================================================
    // GETTERS Y SETTERS
    // =================================================

    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {

        this.id = id;
    }


    public User getUser() {
        return user;
    }

    public void setUser(
            User user) {

        this.user = user;
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