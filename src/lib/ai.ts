import { Game } from 'js-chess-engine';
import { type Square } from 'chess.js';

export interface AIMove {
  from: Square;
  to: Square;
}

export class ChessAI {
  private game: Game;
  private difficulty: number;

  constructor(fen: string, difficulty: number = 2) {
    this.game = new Game(fen);
    this.difficulty = difficulty;
  }

  makeMove(): AIMove {
    const move = this.game.aiMove(this.difficulty);
    const [from, to] = Object.entries(move)[0];
    return {
      from: from.toLowerCase() as Square,
      to: to.toLowerCase() as Square,
    };
  }

  updatePosition(fen: string) {
    this.game = new Game(fen);
  }

  setDifficulty(level: number) {
    this.difficulty = level;
  }
}