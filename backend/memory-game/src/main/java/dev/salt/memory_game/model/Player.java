package dev.salt.memory_game.model;

public class Player {

    //Instansvariabler
    private String name;
    private int score;

    //Konstruktor
    public Player(String name) {
        this.name = name;
        this.score = 0;
    }

    public String getName() { return name; } //just returns the name
    public int getScore() { return score; } //just returns the score
    public void incrementScore() { score++; } //increases the value
}