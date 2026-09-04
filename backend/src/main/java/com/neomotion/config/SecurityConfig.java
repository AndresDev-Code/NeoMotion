package com.neomotion.config;

import com.neomotion.auth.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =================================================
    // SECURITY FILTER CHAIN
    // =================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf ->
                        csrf.disable()
                )

                .cors(cors ->
                {
                })

                .authorizeHttpRequests(auth -> auth

                        // =================================
                        // AUTENTICACIÓN PÚBLICA
                        // =================================

                        .requestMatchers(
                                "/auth/login",
                                "/api/users"
                        ).permitAll()


                        // =================================
                        // CATÁLOGO PÚBLICO
                        // =================================

                        .requestMatchers(
                                "/api/series",
                                "/api/series/**",
                                "/api/seasons",
                                "/api/seasons/**",
                                "/api/episodes",
                                "/api/episodes/**",
                                "/api/media-content",
                                "/api/media-content/**",
                                "/uploads/**"
                        ).permitAll()


                        // =================================
                        // NOTICIAS PÚBLICAS
                        // =================================

                        .requestMatchers(
                                "/api/news",
                                "/api/news/*"
                        ).permitAll()


                        // =================================
                        // PROGRAMACIÓN / PLAYBACK PÚBLICO
                        // =================================

                        .requestMatchers(
                                "/api/schedules/current",
                                "/api/schedules/next",
                                "/api/schedules/today",
                                "/api/playback/current",
                                "/api/playback/next",
                                "/api/playback/state"
                        ).permitAll()


                        // =================================
                        // ADMINISTRACIÓN
                        // =================================

                        .requestMatchers(
                                "/api/categories/**",
                                "/api/programming-blocks/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/recommendations/mine"
                        ).authenticated()


                        // =================================
                        // TODO LO DEMÁS
                        // =================================

                        .anyRequest().authenticated()
                )


                // =========================================
                // JWT
                // =========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =================================================
    // AUTHENTICATION MANAGER
    // =================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =================================================
    // PASSWORD ENCODER
    // =================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =================================================
    // CORS
    // =================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setAllowCredentials(
                true
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}