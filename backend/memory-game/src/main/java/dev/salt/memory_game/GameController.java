package dev.salt.memory_game;

import org.springframework.web.bind.annotation.*;

import dev.salt.memory_game.dto.FlipRequest;
import dev.salt.memory_game.dto.FlipResultDto;
import dev.salt.memory_game.dto.GameStateDto;
import dev.salt.memory_game.service.GameTheTest;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/game")
public class GameController {

    private final GameTheTest gameService;

    public GameController(GameTheTest gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/{name}")
    public GameStateDto startGame(@PathVariable String name) {
        return gameService.startGame(name);
    }

    @GetMapping("/{name}")
    public GameStateDto getGame(@PathVariable String name) {
        return gameService.getGame(name);
    }

    @PostMapping("/{name}/flip")
    public FlipResultDto flip(@PathVariable String name, @RequestBody FlipRequest request) {
        return gameService.flip(name, request.firstIndex(), request.secondIndex());
    }
}
