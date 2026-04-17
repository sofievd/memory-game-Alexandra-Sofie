package dev.salt.memory_game;

import dev.salt.memory_game.model.MemoryPlayerGame;
import java.util.Optional;

public interface GameRepository {
    void save(String playerName, MemoryPlayerGame game);

    Optional<MemoryPlayerGame> findByPlayerName(String playerName);

    void delete(String playerName);
}
