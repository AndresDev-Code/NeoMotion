package com.neomotion.service;

import com.neomotion.dto.RecommendationRequestDTO;
import com.neomotion.dto.RecommendationResponseDTO;
import com.neomotion.dto.RecommendationStatusRequestDTO;
import com.neomotion.entity.Recommendation;
import com.neomotion.entity.User;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.RecommendationRepository;
import com.neomotion.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationServiceImpl
        implements RecommendationService {

    private final RecommendationRepository
            recommendationRepository;

    private final UserRepository
            userRepository;


    public RecommendationServiceImpl(
            RecommendationRepository recommendationRepository,
            UserRepository userRepository) {

        this.recommendationRepository =
                recommendationRepository;

        this.userRepository =
                userRepository;
    }


    // =================================================
    // CREAR
    // =================================================

    @Override
    @Transactional
    public RecommendationResponseDTO create(
            RecommendationRequestDTO request) {

        User user =
                obtenerUsuarioAutenticado();


        Recommendation recommendation =
                new Recommendation();


        recommendation.setUser(
                user
        );

        recommendation.setTitle(
                request.getTitle()
        );

        recommendation.setReason(
                request.getReason()
        );


        Recommendation saved =
                recommendationRepository.save(
                        recommendation
                );


        return toResponseDTO(
                saved
        );
    }


    // =================================================
    // MIS RECOMENDACIONES
    // =================================================

    @Override
    @Transactional
    public List<RecommendationResponseDTO> findMine() {

        User user =
                obtenerUsuarioAutenticado();


        return recommendationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    // =================================================
    // TODAS
    // =================================================

    @Override
    @Transactional
    public List<RecommendationResponseDTO> findAll() {

        return recommendationRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    // =================================================
    // POR ID
    // =================================================

    @Override
    @Transactional
    public RecommendationResponseDTO findById(
            Long id) {

        Recommendation recommendation =
                recommendationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Recomendación no encontrada."
                                )
                        );


        return toResponseDTO(
                recommendation
        );
    }


    // =================================================
    // ACTUALIZAR ESTADO
    // =================================================

    @Override
    @Transactional
    public RecommendationResponseDTO updateStatus(
            Long id,
            RecommendationStatusRequestDTO request) {

        Recommendation recommendation =
                recommendationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Recomendación no encontrada."
                                )
                        );


        recommendation.setStatus(
                request.getStatus()
        );


        Recommendation updated =
                recommendationRepository.save(
                        recommendation
                );


        return toResponseDTO(
                updated
        );
    }


    // =================================================
    // ELIMINAR
    // =================================================

    @Override
    public void deleteById(
            Long id) {

        if (
                !recommendationRepository
                        .existsById(id)
        ) {

            throw new ResourceNotFoundException(
                    "Recomendación no encontrada."
            );
        }


        recommendationRepository.deleteById(
                id
        );
    }


    // =================================================
    // USUARIO AUTENTICADO
    // =================================================

    private User obtenerUsuarioAutenticado() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        String username =
                authentication.getName();


        return userRepository
                .findByUsername(
                        username
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );
    }


    // =================================================
    // DTO
    // =================================================

    private RecommendationResponseDTO toResponseDTO(
            Recommendation recommendation) {

        RecommendationResponseDTO response =
                new RecommendationResponseDTO();


        response.setId(
                recommendation.getId()
        );


        response.setUserId(
                recommendation
                        .getUser()
                        .getId()
        );


        response.setUsername(
                recommendation
                        .getUser()
                        .getUsername()
        );


        response.setTitle(
                recommendation
                        .getTitle()
        );


        response.setReason(
                recommendation
                        .getReason()
        );


        response.setStatus(
                recommendation
                        .getStatus()
        );


        response.setCreatedAt(
                recommendation
                        .getCreatedAt()
        );


        response.setUpdatedAt(
                recommendation
                        .getUpdatedAt()
        );


        return response;
    }

    // =================================================
// ELIMINAR MI RECOMENDACIÓN
// =================================================

    @Override
    @Transactional
    public void deleteMine(
            Long id) {

        User user =
                obtenerUsuarioAutenticado();


        Recommendation recommendation =
                recommendationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Recomendación no encontrada."
                                )
                        );


        if (
                !recommendation
                        .getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new ResourceNotFoundException(
                    "Recomendación no encontrada."
            );
        }


        recommendationRepository.delete(
                recommendation
        );
    }
}