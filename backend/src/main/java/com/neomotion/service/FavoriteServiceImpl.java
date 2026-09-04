package com.neomotion.service;

import com.neomotion.dto.FavoriteResponseDTO;
import com.neomotion.entity.Favorite;
import com.neomotion.entity.Series;
import com.neomotion.entity.User;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.FavoriteRepository;
import com.neomotion.repository.SeriesRepository;
import com.neomotion.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteServiceImpl
        implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final SeriesRepository seriesRepository;
    private final UserRepository userRepository;

    public FavoriteServiceImpl(
            FavoriteRepository favoriteRepository,
            SeriesRepository seriesRepository,
            UserRepository userRepository) {

        this.favoriteRepository =
                favoriteRepository;

        this.seriesRepository =
                seriesRepository;

        this.userRepository =
                userRepository;
    }

    @Override
    @Transactional
    public FavoriteResponseDTO add(
            Long seriesId) {

        User user =
                obtenerUsuarioAutenticado();

        Series series =
                seriesRepository
                        .findById(seriesId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Serie no encontrada."
                                )
                        );

        if (
                favoriteRepository
                        .existsByUserIdAndSeriesId(
                                user.getId(),
                                seriesId
                        )
        ) {

            throw new ResourceConflictException(
                    "La serie ya está en favoritos."
            );
        }

        Favorite favorite =
                new Favorite();

        favorite.setUser(user);
        favorite.setSeries(series);

        Favorite saved =
                favoriteRepository.save(
                        favorite
                );

        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void remove(
            Long seriesId) {

        User user =
                obtenerUsuarioAutenticado();

        if (
                !favoriteRepository
                        .existsByUserIdAndSeriesId(
                                user.getId(),
                                seriesId
                        )
        ) {

            throw new ResourceNotFoundException(
                    "La serie no está en favoritos."
            );
        }

        favoriteRepository
                .deleteByUserIdAndSeriesId(
                        user.getId(),
                        seriesId
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponseDTO> findMine() {

        User user =
                obtenerUsuarioAutenticado();

        return favoriteRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean exists(
            Long seriesId) {

        User user =
                obtenerUsuarioAutenticado();

        return favoriteRepository
                .existsByUserIdAndSeriesId(
                        user.getId(),
                        seriesId
                );
    }

    private User obtenerUsuarioAutenticado() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );
    }

    private FavoriteResponseDTO toResponseDTO(
            Favorite favorite) {

        FavoriteResponseDTO response =
                new FavoriteResponseDTO();

        response.setId(
                favorite.getId()
        );

        response.setSeriesId(
                favorite.getSeries().getId()
        );

        response.setSeriesTitle(
                favorite.getSeries().getTitle()
        );

        response.setSeriesDescription(
                favorite.getSeries().getDescription()
        );

        response.setImageUrl(
                favorite.getSeries().getImageUrl()
        );

        response.setCreatedAt(
                favorite.getCreatedAt()
        );

        return response;
    }
}
