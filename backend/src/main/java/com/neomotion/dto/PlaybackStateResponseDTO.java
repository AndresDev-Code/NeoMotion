package com.neomotion.dto;

public class PlaybackStateResponseDTO {

    private PlaybackResponseDTO current;

    private PlaybackResponseDTO next;


    // =============================================
    // CURRENT
    // =============================================

    public PlaybackResponseDTO getCurrent() {
        return current;
    }

    public void setCurrent(
            PlaybackResponseDTO current) {

        this.current = current;
    }


    // =============================================
    // NEXT
    // =============================================

    public PlaybackResponseDTO getNext() {
        return next;
    }

    public void setNext(
            PlaybackResponseDTO next) {

        this.next = next;
    }
}