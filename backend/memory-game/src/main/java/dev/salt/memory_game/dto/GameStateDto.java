package dev.salt.memory_game.dto;

import java.util.List;
import java.util.Set;

public record GameStateDto(
        String playerName,
        List<Integer> cards,
        Set<Integer> matchedIndices,
        int score,
        int moves,
        boolean finished
) {
}

