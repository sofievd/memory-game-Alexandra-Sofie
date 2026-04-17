package dev.salt.memory_game.dto;

public record FlipResultDto(
        boolean match,
        String message,
        int firstIndex,
        int secondIndex,
        int firstValue,
        int secondValue,
        GameStateDto game
) {
}

