import { Chess, type Square } from 'chess.js';
import { create } from 'zustand';
import { ChessAI } from './ai';

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
  matchType: 'ranked' | 'tournament' | 'casual' | 'computer';
  ai: ChessAI | null;
}

interface GameActions {
  initGame: (
    gameMode: 'demo' | 'live',
    matchType: 'ranked' | 'tournament' | 'casual' | 'computer',
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
    white: 600,
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
  ai: null,

  initGame: (gameMode, matchType, stake = 0) => {
    const game = new Chess();
    const ai = matchType === 'computer' ? new ChessAI(game.fen()) : null;

    // Set up demo players
    const players = {
      white: {
        id: '1',
        username: gameMode === 'demo' ? 'Player' : 'You',
        elo: 1200,
      },
      black: {
        id: '2',
        username: matchType === 'computer' ? 'Computer' : 'Opponent',
        elo: 1200,
      },
    };

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
      players,
      ai,
    });
  },

  selectSquare: (square) => {
    const { game, selectedSquare, turn, matchType } = get();

    // If it's black's turn and we're in computer mode, don't allow selection
    if (turn === 'b' && matchType === 'computer') {
      return;
    }

    const piece = game.get(square);

    // If a square is already selected
    if (selectedSquare) {
      // Try to make a move if the selected square is different
      if (selectedSquare !== square) {
        try {
          // Get all legal moves for the selected piece
          const moves = game.moves({ square: selectedSquare, verbose: true });
          const isValidMove = moves.some((move) => move.to === square);

          if (isValidMove) {
            get().makeMove(selectedSquare, square);
          }
        } catch (error) {
          console.error('Error checking moves:', error);
        }
      }
      // Clear selection
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    // If no square is selected and the clicked square has a piece of the correct color
    if (piece && piece.color === turn) {
      try {
        const moves = game.moves({ square, verbose: true });
        set({
          selectedSquare: square,
          validMoves: moves.map((move) => move.to as Square),
        });
      } catch (error) {
        console.error('Error getting valid moves:', error);
        set({ selectedSquare: null, validMoves: [] });
      }
    }
  },

  makeMove: (from, to) => {
    const { game, turn, moveHistory, capturedPieces, matchType, ai } = get();
    
    try {
      // Create a new Chess instance to validate the move
      const tempGame = new Chess(game.fen());
      const move = tempGame.move({ from, to, promotion: 'q' });

      if (move) {
        // If move is valid, apply it to the actual game
        game.move({ from, to, promotion: 'q' });
        
        const newHistory = [...moveHistory, `${from}${to}`];
        const newCapturedPieces = { ...capturedPieces };

        if (move.captured) {
          const capturedBy = turn === 'w' ? 'white' : 'black';
          newCapturedPieces[capturedBy].push(move.captured);
        }

        const newState = {
          game: new Chess(game.fen()),
          selectedSquare: null,
          validMoves: [],
          turn: game.turn(),
          moveHistory: newHistory,
          capturedPieces: newCapturedPieces,
          isGameOver: game.isGameOver(),
          winner: game.isCheckmate() ? turn : game.isDraw() ? 'd' : null,
        };

        set(newState);

        // If it's a computer match and it's black's turn, make AI move
        if (matchType === 'computer' && !game.isGameOver() && game.turn() === 'b') {
          setTimeout(() => {
            if (ai) {
              ai.updatePosition(game.fen());
              const aiMove = ai.makeMove();
              get().makeMove(aiMove.from, aiMove.to);
            }
          }, 500);
        }
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
    // For computer matches, always reject
    const { matchType } = get();
    if (matchType === 'computer') {
      get().rejectDraw();
    }
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
    // For computer matches, always accept
    const { matchType } = get();
    if (matchType === 'computer') {
      get().acceptUndo();
    }
  },

  acceptUndo: () => {
    const { game, moveHistory, matchType } = get();
    if (moveHistory.length > 0) {
      game.undo();
      if (matchType === 'computer') {
        game.undo(); // Undo both player and computer moves
      }
      set({
        game: new Chess(game.fen()),
        moveHistory: moveHistory.slice(0, -1),
        turn: game.turn(),
        selectedSquare: null,
        validMoves: [],
      });
    }
  },

  rejectUndo: () => {
    // Implement undo rejection logic
  },
}));