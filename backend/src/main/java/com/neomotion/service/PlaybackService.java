package com.neomotion.service;

import com.neomotion.dto.PlaybackResponseDTO;
import com.neomotion.dto.PlaybackStateResponseDTO;

public interface PlaybackService {

    // =============================================
    // OBTENER REPRODUCCIÓN ACTUAL
    // =============================================

    PlaybackResponseDTO getCurrentPlayback();


    // =============================================
    // OBTENER SIGUIENTE CONTENIDO
    // =============================================

    PlaybackResponseDTO getNextPlayback();


    // =============================================
    // OBTENER ESTADO GENERAL DEL CANAL
    // =============================================

    PlaybackStateResponseDTO getPlaybackState();
}