package com.neomotion.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;


    @Value("${jwt.expiration}")
    private long jwtExpiration;


    // =================================================
    // GENERAR TOKEN
    // =================================================

    public String generateToken(
            String username) {

        SecretKey key =
                Keys.hmacShaKeyFor(
                        secretKey.getBytes(
                                StandardCharsets.UTF_8
                        )
                );


        return Jwts.builder()

                .subject(
                        username
                )

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )

                .signWith(
                        key
                )

                .compact();
    }


    // =================================================
    // EXTRAER USERNAME
    // =================================================

    public String extractUsername(
            String token) {

        Claims claims =
                extractClaims(
                        token
                );


        return claims.getSubject();
    }


    // =================================================
    // EXTRAER EXPIRACIÓN
    // =================================================

    public Date extractExpiration(
            String token) {

        Claims claims =
                extractClaims(
                        token
                );


        return claims.getExpiration();
    }


    // =================================================
    // EXTRAER CLAIMS
    // =================================================

    private Claims extractClaims(
            String token) {

        SecretKey key =
                Keys.hmacShaKeyFor(
                        secretKey.getBytes(
                                StandardCharsets.UTF_8
                        )
                );


        return Jwts.parser()

                .verifyWith(
                        key
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();
    }


    // =================================================
    // TOKEN EXPIRADO
    // =================================================

    private boolean isTokenExpired(
            String token) {

        try {

            return extractExpiration(
                    token
            ).before(
                    new Date()
            );

        } catch (
                JwtException |
                IllegalArgumentException exception
        ) {

            return true;
        }
    }


    // =================================================
    // VALIDAR TOKEN
    // =================================================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        try {

            String username =
                    extractUsername(
                            token
                    );


            return username != null
                    && username.equals(
                    userDetails.getUsername()
            )
                    && !isTokenExpired(
                    token
            );

        } catch (
                JwtException |
                IllegalArgumentException exception
        ) {

            return false;
        }
    }
}