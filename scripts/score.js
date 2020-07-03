const WINNING_SCORE = 3;

class ScoreManager {
    constructor() {
        this.scores = [0, 0];
        this.scoreLimit = WINNING_SCORE;
    }

    reset() {
        this.scores.fill(0);
    }

    add(player, amount) {
        if (this.winner) return; //Prevent scoring after the round has been won
        this.scores[player] += amount;
    }

    get winner() {
        for (let i=0; i < this.scores.length; i++) {
            if (this.scores[i] >= this.scoreLimit)
                return i + 1;
        }
        return null;
    }
}