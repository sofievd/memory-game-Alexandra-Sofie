package dev.salt.memory_game.model;

import java.util.*;

public class MemoryPlayerGame {
    private final Player player;
    private final List<Integer> board;
    private final Set<Integer> matchedIndices;
    private int moves;
    private boolean finished;

    public MemoryPlayerGame(Player player) {
        this.player = player;
        this.matchedIndices = new HashSet<>();
        this.moves = 0;
        this.finished = false;

        // 1. Create pairs of Penguin IDs (8 pairs = 16 cards)
        List<Integer> cards = new ArrayList<>();
        for (int i = 1; i <= 8; i++) {
            cards.add(i);
            cards.add(i);
        }

        // 2. Shuffle using your existing logic
        Collections.shuffle(cards);
        this.board = cards;
    }

    public boolean checkMatch(int index1, int index2) {
        if (!isValidIndex(index1) || !isValidIndex(index2)) {
            return false;
        }

        if (index1 == index2 || matchedIndices.contains(index1) || matchedIndices.contains(index2)) {
            return false;
        }

        moves++;

        if (board.get(index1).equals(board.get(index2))) {
            matchedIndices.add(index1);
            matchedIndices.add(index2);
            player.incrementScore();
            if (matchedIndices.size() == board.size()) {
                finished = true;
            }
            return true;
        }
        return false;
    }

    public List<Integer> getBoard() {
        return board;
    }

    public Set<Integer> getMatchedIndices() {
        return matchedIndices;
    }

    public int getMoves() {
        return moves;
    }

    public boolean isFinished() {
        return finished;
    }

    public int getScore() {
        return player.getScore();
    }

    public int getCardValue(int index) {
        return board.get(index);
    }

    private boolean isValidIndex(int index) {
        return index >= 0 && index < board.size();
    }
}
