package dev.salt.memory_game;

import dev.salt.memory_game.model.MemoryPlayerGame;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
public class InMemoryGameRepository implements GameRepository {

    private final Map<String, MemoryPlayerGame> store = new HashMap<>();

    @Override
    public void save(String playerName, MemoryPlayerGame game) {

        store.put(playerName, game);
    }

    @Override
    public Optional<MemoryPlayerGame> findByPlayerName(String playerName) {
        return Optional.ofNullable(store.get(playerName));
    }

    @Override
    public void delete(String playerName) {
        store.remove(playerName);
    }
}
