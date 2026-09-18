package com.neomotion.auth.filter;

import com.neomotion.auth.jwt.JwtService;
import com.neomotion.auth.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService =
                jwtService;

        this.userDetailsService =
                userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader(
                        "Authorization"
                );

        // =================================================
        // NO HAY TOKEN
        // =================================================

        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =================================================
        // EXTRAER TOKEN
        // =================================================

        String jwt =
                authHeader.substring(7).trim();

        // =================================================
        // TOKEN VACÍO
        // =================================================

        if (jwt.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            // =================================================
            // EXTRAER USUARIO
            // =================================================

            String username =
                    jwtService.extractUsername(
                            jwt
                    );

            // =================================================
            // VALIDAR USUARIO
            // =================================================

            if (
                    username == null ||
                            username.isBlank()
            ) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // =================================================
            // EVITAR REAUTENTICACIÓN
            // =================================================

            if (
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            == null
            ) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );

                // =================================================
                // VALIDAR TOKEN
                // =================================================

                if (
                        jwtService.isTokenValid(
                                jwt,
                                userDetails
                        )
                ) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails
                                            .getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(
                                            request
                                    )
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authToken
                            );
                }
            }

        } catch (Exception exception) {

            /*
             * Un token inválido, corrupto, expirado
             * o asociado a un usuario inexistente
             * no debe romper la petición.
             *
             * Esto es especialmente importante
             * para endpoints públicos de NeoMotion.
             */

        }

        // =================================================
        // CONTINUAR CADENA
        // =================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}