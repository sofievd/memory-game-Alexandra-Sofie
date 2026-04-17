package dev.salt.memory_game.dto;

import jakarta.validation.constraints.Min;

public record FlipRequest(
        @Min(0) int firstIndex,
        @Min(0) int secondIndex
) {
}

