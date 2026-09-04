package com.neomotion.service;

public class FragmentInfo {

    private final int startOffset;

    private final int endOffset;

    private final int durationSeconds;


    public FragmentInfo(
            int startOffset,
            int endOffset,
            int durationSeconds) {

        this.startOffset =
                startOffset;

        this.endOffset =
                endOffset;

        this.durationSeconds =
                durationSeconds;
    }


    public int getStartOffset() {
        return startOffset;
    }


    public int getEndOffset() {
        return endOffset;
    }


    public int getDurationSeconds() {
        return durationSeconds;
    }
}