import { Chess, type Square } from 'chess.js';
import { create } from 'zustand';

export interface Player {
  id: string;
  username: string;
  elo: number;
  avatar?: string;
}

interface GameState {
  game: Chess;
  selectedSquare: Square | null;
  validMoves: Square[];
  turn: 'w' | 'b';
  players: {
    white: Player | null;
    black: Player | null;
  };
  timeLeft: {
    white: number;
    black: number;
  };
  isGameOver: boolean;
  winner: 'w' | 'b' | 'd' | null;
  moveHistory: string[];
  capturedPieces: {
    white: string[];
    black: string[];
  };
  stake: number;
  gameMode: 'demo' | 'live';
  matchType: 'ranked' | 'tournament' | 'casual';
}

interface GameActions {
  initGame: (
    gameMode: 'demo' | 'live',
    matchType: 'ranked' | 'tournament' | 'casual',
    stake?: number
  ) => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => void;
  resign: () => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  rejectDraw: () => void;
  requestUndo: () => void;
  acceptUndo: () => void;
  rejectUndo: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  game: new Chess(),
  selectedSquare: null,
  validMoves: [],
  turn: 'w',
  players: {
    white: null,
    black: null,
  },
  timeLeft: {
    white: 600, // 10 minutes
    black: 600,
  },
  isGameOver: false,
  winner: null,
  moveHistory: [],
  capturedPieces: {
    white: [],
    black: [],
  },
  stake: 0,
  gameMode: 'demo',
  matchType: 'casual',

  initGame: (gameMode, matchType, stake = 0) => {
    const game = new Chess();
    set({
      game,
      gameMode,
      matchType,
      stake,
      selectedSquare: null,
      validMoves: [],
      turn: 'w',
      isGameOver: false,
      winner: null,
      moveHistory: [],
      capturedPieces: {
        white: [],
        black: [],
      },
      timeLeft: {
        white: 600,
        black: 600,
      },
    });
  },

  selectSquare: (square) => {
    const { game } = get();
    const moves = game.moves({ square, verbose: true });
    set({
      selectedSquare: square,
      validMoves: moves.map((move) => move.to as Square),
    });
  },

  makeMove: (from, to) => {
    const { game, turn, moveHistory, capturedPieces } = get();
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const newHistory = [...moveHistory, `${move.from}${move.to}`];
        const newCapturedPieces = { ...capturedPieces };

        if (move.captured) {
          const capturedBy = turn === 'w' ? 'white' : 'black';
          newCapturedPieces[capturedBy].push(move.captured);
        }

        set({
          game: new Chess(game.fen()),
          selectedSquare: null,
          validMoves: [],
          turn: turn === 'w' ? 'b' : 'w',
          moveHistory: newHistory,
          capturedPieces: newCapturedPieces,
          isGameOver: game.isGameOver(),
          winner: game.isCheckmate() ? turn : game.isDraw() ? 'd' : null,
        });
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  },

  resign: () => {
    const { turn } = get();
    set({
      isGameOver: true,
      winner: turn === 'w' ? 'b' : 'w',
    });
  },

  offerDraw: () => {
    // Implement draw offer logic
  },

  acceptDraw: () => {
    set({
      isGameOver: true,
      winner: 'd',
    });
  },

  rejectDraw: () => {
    // Implement draw rejection logic
  },

  requestUndo: () => {
    // Implement undo request logic
  },

  acceptUndo: () => {
    const { game, moveHistory } = get();
    if (moveHistory.length > 0) {
      game.undo();
      set({
        game: new Chess(game.fen()),
        moveHistory: moveHistory.slice(0, -1),
        turn: game.turn(),
      });
    }
  },

  rejectUndo: () => {
    // Implement undo rejection logic
  },
}));