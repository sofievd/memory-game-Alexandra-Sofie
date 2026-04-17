package dev.salt.memory_game.service;

import dev.salt.memory_game.dto.FlipResultDto;
import dev.salt.memory_game.dto.GameStateDto;
import dev.salt.memory_game.GameRepository;
import dev.salt.memory_game.model.MemoryPlayerGame;
import dev.salt.memory_game.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameTheTest {

    private final GameRepository repository;

    public GameTheTest(GameRepository repository) {
        this.repository = repository;
    }

    public GameStateDto startGame(String playerName) {
        Player player = new Player(playerName);
        MemoryPlayerGame game = new MemoryPlayerGame(player);
        repository.save(playerName, game);
        return toDto(playerName, game);
    }

    public GameStateDto getGame(String playerName) {
        return repository.findByPlayerName(playerName)// if found true, or falls
                .map(game -> toDto(playerName, game))
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public FlipResultDto flip(String playerName, int firstIndex, int secondIndex) {
        MemoryPlayerGame game = repository.findByPlayerName(playerName)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (!isValidIndex(game, firstIndex) || !isValidIndex(game, secondIndex)) {
            return new FlipResultDto(false, "Invalid card index", firstIndex, secondIndex, -1, -1, toDto(playerName, game));
        }

        if (firstIndex == secondIndex) {
            return new FlipResultDto(false, "Pick two different cards", firstIndex, secondIndex, game.getCardValue(firstIndex), game.getCardValue(secondIndex), toDto(playerName, game));
        }

        if (game.getMatchedIndices().contains(firstIndex) || game.getMatchedIndices().contains(secondIndex)) {
            return new FlipResultDto(false, "That card is already matched", firstIndex, secondIndex, game.getCardValue(firstIndex), game.getCardValue(secondIndex), toDto(playerName, game));
        }

        if (!game.checkMatch(firstIndex, secondIndex)) {
            return new FlipResultDto(
                    false,
                    "No match",
                    firstIndex,
                    secondIndex,
                    safeCardValue(game, firstIndex),
                    safeCardValue(game, secondIndex),
                    toDto(playerName, game)
            );
        }

        return new FlipResultDto(
                true,
                "Match!",
                firstIndex,
                secondIndex,
                game.getCardValue(firstIndex),
                game.getCardValue(secondIndex),
                toDto(playerName, game)
        );
    }

    private GameStateDto toDto(String playerName, MemoryPlayerGame game) {
        return new GameStateDto(
                playerName,
                new ArrayList<>(game.getBoard()),
                game.getMatchedIndices(),
                game.getScore(),
                game.getMoves(),
                game.isFinished()
        );
    }

    private boolean isValidIndex(MemoryPlayerGame game, int index) {
        return index >= 0 && index < game.getBoard().size();
    }

    private int safeCardValue(MemoryPlayerGame game, int index) {
        return isValidIndex(game, index) ? game.getCardValue(index) : -1;
    }
}
