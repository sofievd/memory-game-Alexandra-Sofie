package dev.salt.memory_game.model;

import java.util.*;

public class PlayerGame {

    private final Player player;
    private final Map<Integer, String> sayHi;
    private final List<Integer> shuffledKeys;
    private int currentIndex;

    public PlayerGame(Player player) {
        this.player = player;

        this.sayHi = new HashMap<>();
        sayHi.put(1, "Hola");
        sayHi.put(2, "Bonjour");
        sayHi.put(3, "Ciao");
        sayHi.put(4, "Hallo");
        sayHi.put(5, "Hej");
        sayHi.put(6, "こんにちは");
        sayHi.put(7, "안녕하세요");
        sayHi.put(8, "Olá");
        sayHi.put(9, "Привет");

        this.shuffledKeys = new ArrayList<>(sayHi.keySet());
        Collections.shuffle(shuffledKeys); //this shuffles the ArrayList
        this.currentIndex = 0;
    }

    public Player getPlayer() { return player; }

    public Map<Integer, String> getSayHi() { return sayHi; }

    public String getNextQuestion() {
        if (currentIndex >= shuffledKeys.size()) {
            return "Game over! Score: " + player.getScore() + "/" + sayHi.size();
        }
        int key = shuffledKeys.get(currentIndex); //getting the shuffled key from the index
        return "Which number is this greeting? " + sayHi.get(key); //you get the shuffled key and get the value from the HashMap
    }

    public String checkAnswer(int guess) {
        if (currentIndex >= shuffledKeys.size()) {
            return "Game already finished!";
        }
        int correct = shuffledKeys.get(currentIndex);
        currentIndex++;
        if (guess == correct) {
            player.incrementScore(); //store the score in the model
            return "Correct! Score: " + player.getScore();
        } else {
            //return "Wrong! It was " + correct + ". Score: " + player.getScore();
            return "Wrong! It was " + correct + ".";
        }
    }
}
