package com.neomotion.controller;

import com.neomotion.dto.PlaybackResponseDTO;
import com.neomotion.dto.PlaybackStateResponseDTO;
import com.neomotion.service.PlaybackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/playback")
public class PlaybackController {

    private final PlaybackService playbackService;


    public PlaybackController(
            PlaybackService playbackService) {

        this.playbackService =
                playbackService;
    }


    // =================================================
    // OBTENER REPRODUCCIÓN ACTUAL
    // =================================================

    @GetMapping("/current")
    public ResponseEntity<PlaybackResponseDTO>
    getCurrentPlayback() {

        PlaybackResponseDTO response =
                playbackService
                        .getCurrentPlayback();

        return ResponseEntity.ok(
                response
        );
    }


    // =================================================
    // OBTENER SIGUIENTE CONTENIDO
    // =================================================

    @GetMapping("/next")
    public ResponseEntity<PlaybackResponseDTO>
    getNextPlayback() {

        PlaybackResponseDTO response =
                playbackService
                        .getNextPlayback();

        return ResponseEntity.ok(
                response
        );
    }


    // =================================================
    // OBTENER ESTADO GENERAL DEL CANAL
    // =================================================

    @GetMapping("/state")
    public ResponseEntity<PlaybackStateResponseDTO>
    getPlaybackState() {

        PlaybackStateResponseDTO response =
                playbackService
                        .getPlaybackState();

        return ResponseEntity.ok(
                response
        );
    }
}