import { create } from 'zustand';

export type Piece = {
  color: 'red' | 'black';
  isKing: boolean;
};

export type Position = {
  row: number;
  col: number;
};

export type Move = {
  from: Position;
  to: Position;
  captured?: Position;
};

export type Board = (Piece | null)[][];

interface CheckersState {
  board: Board;
  turn: 'red' | 'black';
  selectedPiece: Position | null;
  validMoves: Position[];
  isGameOver: boolean;
  winner: 'red' | 'black' | null;
  players: {
    red: { id: string; username: string; elo: number } | null;
    black: { id: string; username: string; elo: number } | null;
  };
  gameMode: 'demo' | 'live';
  matchType: 'ranked' | 'tournament' | 'casual' | 'computer';
  stake: number;
}

interface CheckersActions {
  initGame: (
    gameMode: 'demo' | 'live',
    matchType: 'ranked' | 'tournament' | 'casual' | 'computer',
    stake?: number
  ) => void;
  selectPiece: (position: Position) => void;
  makeMove: (from: Position, to: Position) => void;
  resign: () => void;
}

const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place black pieces
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'black', isKing: false };
      }
    }
  }

  // Place red pieces
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'red', isKing: false };
      }
    }
  }

  return board;
};

const getValidMoves = (board: Board, position: Position): Position[] => {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const directions = piece.isKing ? [-1, 1] : piece.color === 'red' ? [-1] : [1];

  // Check regular moves
  for (const dRow of directions) {
    for (const dCol of [-1, 1]) {
      const newRow = position.row + dRow;
      const newCol = position.col + dCol;

      if (
        newRow >= 0 && newRow < 8 &&
        newCol >= 0 && newCol < 8 &&
        !board[newRow][newCol]
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  // Check jumps
  for (const dRow of directions) {
    for (const dCol of [-1, 1]) {
      const jumpRow = position.row + dRow * 2;
      const jumpCol = position.col + dCol * 2;
      const midRow = position.row + dRow;
      const midCol = position.col + dCol;

      if (
        jumpRow >= 0 && jumpRow < 8 &&
        jumpCol >= 0 && jumpCol < 8 &&
        !board[jumpRow][jumpCol] &&
        board[midRow][midCol]?.color !== piece.color
      ) {
        moves.push({ row: jumpRow, col: jumpCol });
      }
    }
  }

  return moves;
};

const isJump = (from: Position, to: Position): boolean => {
  return Math.abs(from.row - to.row) === 2;
};

const getCapturedPosition = (from: Position, to: Position): Position => {
  return {
    row: from.row + (to.row - from.row) / 2,
    col: from.col + (to.col - from.col) / 2,
  };
};

const shouldBecomeKing = (piece: Piece, position: Position): boolean => {
  return (
    (piece.color === 'red' && position.row === 0) ||
    (piece.color === 'black' && position.row === 7)
  );
};

export const useCheckersStore = create<CheckersState & CheckersActions>((set, get) => ({
  board: createInitialBoard(),
  turn: 'red',
  selectedPiece: null,
  validMoves: [],
  isGameOver: false,
  winner: null,
  players: {
    red: null,
    black: null,
  },
  gameMode: 'demo',
  matchType: 'casual',
  stake: 0,

  initGame: (gameMode, matchType, stake = 0) => {
    const players = {
      red: {
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
      board: createInitialBoard(),
      turn: 'red',
      selectedPiece: null,
      validMoves: [],
      isGameOver: false,
      winner: null,
      players,
      gameMode,
      matchType,
      stake,
    });
  },

  selectPiece: (position) => {
    const { board, turn, matchType } = get();

    // If it's black's turn and we're in computer mode, don't allow selection
    if (turn === 'black' && matchType === 'computer') {
      return;
    }

    const piece = board[position.row][position.col];

    if (piece && piece.color === turn) {
      const validMoves = getValidMoves(board, position);
      set({ selectedPiece: position, validMoves });
    } else {
      set({ selectedPiece: null, validMoves: [] });
    }
  },

  makeMove: (from, position) => {
    const { board, turn, matchType } = get();
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];

    if (!piece) return;

    // Move the piece
    newBoard[position.row][position.col] = {
      ...piece,
      isKing: piece.isKing || shouldBecomeKing(piece, position),
    };
    newBoard[from.row][from.col] = null;

    // Handle captures
    if (isJump(from, position)) {
      const captured = getCapturedPosition(from, position);
      newBoard[captured.row][captured.col] = null;
    }

    // Check for game over
    const hasWinner = !newBoard.flat().some(p => p?.color === (turn === 'red' ? 'black' : 'red'));

    set({
      board: newBoard,
      turn: turn === 'red' ? 'black' : 'red',
      selectedPiece: null,
      validMoves: [],
      isGameOver: hasWinner,
      winner: hasWinner ? turn : null,
    });

    // If it's a computer match and it's black's turn, make AI move
    if (matchType === 'computer' && !hasWinner && turn === 'red') {
      setTimeout(() => {
        // Simple AI: randomly select a valid move
        const blackPieces: Position[] = [];
        newBoard.forEach((row, rowIndex) => {
          row.forEach((piece, colIndex) => {
            if (piece?.color === 'black') {
              blackPieces.push({ row: rowIndex, col: colIndex });
            }
          });
        });

        // Shuffle pieces to add randomness
        for (let i = blackPieces.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [blackPieces[i], blackPieces[j]] = [blackPieces[j], blackPieces[i]];
        }

        // Find first piece with valid moves
        for (const piece of blackPieces) {
          const moves = getValidMoves(newBoard, piece);
          if (moves.length > 0) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            get().makeMove(piece, move);
            break;
          }
        }
      }, 500);
    }
  },

  resign: () => {
    const { turn } = get();
    set({
      isGameOver: true,
      winner: turn === 'red' ? 'black' : 'red',
    });
  },
}));