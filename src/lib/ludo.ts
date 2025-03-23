import { create } from 'zustand';

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
export type TokenPosition = number | 'home' | 'start';

interface Token {
  id: string;
  position: TokenPosition;
  isFinished: boolean;
}

interface Player {
  id: string;
  username: string;
  elo: number;
  color: PlayerColor;
  tokens: Token[];
}

interface LudoState {
  players: Record<PlayerColor, Player | null>;
  currentTurn: PlayerColor;
  diceValue: number | null;
  isRolling: boolean;
  selectedToken: string | null;
  validMoves: number[];
  isGameOver: boolean;
  winner: PlayerColor | null;
  gameMode: 'demo' | 'live';
  matchType: 'ranked' | 'tournament' | 'casual' | 'computer';
  stake: number;
}

interface LudoActions {
  initGame: (
    gameMode: 'demo' | 'live',
    matchType: 'ranked' | 'tournament' | 'casual' | 'computer',
    stake?: number
  ) => void;
  rollDice: () => void;
  selectToken: (tokenId: string) => void;
  moveToken: (tokenId: string, position: number) => void;
  resign: () => void;
}

const INITIAL_TOKENS: Token[] = [
  { id: '1', position: 'home', isFinished: false },
  { id: '2', position: 'home', isFinished: false },
  { id: '3', position: 'home', isFinished: false },
  { id: '4', position: 'home', isFinished: false },
];

const START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

const getValidMoves = (position: TokenPosition, diceValue: number, color: PlayerColor): number[] => {
  if (!diceValue) return [];
  if (position === 'home' && diceValue !== 6) return [];
  if (position === 'home' && diceValue === 6) return [START_POSITIONS[color]];

  const currentPos = typeof position === 'number' ? position : START_POSITIONS[color];
  const newPos = (currentPos + diceValue) % 52;
  return [newPos];
};

export const useLudoStore = create<LudoState & LudoActions>((set, get) => ({
  players: {
    red: null,
    green: null,
    yellow: null,
    blue: null,
  },
  currentTurn: 'red',
  diceValue: null,
  isRolling: false,
  selectedToken: null,
  validMoves: [],
  isGameOver: false,
  winner: null,
  gameMode: 'demo',
  matchType: 'casual',
  stake: 0,

  initGame: (gameMode, matchType, stake = 0) => {
    const players: Record<PlayerColor, Player | null> = {
      red: {
        id: '1',
        username: gameMode === 'demo' ? 'Player' : 'You',
        elo: 1200,
        color: 'red',
        tokens: [...INITIAL_TOKENS],
      },
      green: matchType === 'computer' ? {
        id: '2',
        username: 'Computer',
        elo: 1200,
        color: 'green',
        tokens: [...INITIAL_TOKENS],
      } : null,
      yellow: null,
      blue: null,
    };

    set({
      players,
      currentTurn: 'red',
      diceValue: null,
      isRolling: false,
      selectedToken: null,
      validMoves: [],
      isGameOver: false,
      winner: null,
      gameMode,
      matchType,
      stake,
    });
  },

  rollDice: () => {
    const { currentTurn, matchType } = get();
    
    if (matchType === 'computer' && currentTurn !== 'red') return;

    set({ isRolling: true });
    
    setTimeout(() => {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      set({ diceValue, isRolling: false });

      // If it's computer's turn, make a move
      if (matchType === 'computer' && currentTurn === 'green') {
        setTimeout(() => {
          const { players } = get();
          const computerTokens = players.green?.tokens || [];
          
          // Find first valid move
          for (const token of computerTokens) {
            const validMoves = getValidMoves(token.position, diceValue, 'green');
            if (validMoves.length > 0) {
              get().moveToken(token.id, validMoves[0]);
              break;
            }
          }
        }, 1000);
      }
    }, 1000);
  },

  selectToken: (tokenId: string) => {
    const { players, currentTurn, diceValue, matchType } = get();
    
    if (matchType === 'computer' && currentTurn !== 'red') return;

    const player = players[currentTurn];
    if (!player) return;

    const token = player.tokens.find(t => t.id === tokenId);
    if (!token) return;

    const validMoves = getValidMoves(token.position, diceValue || 0, currentTurn);
    set({ selectedToken: tokenId, validMoves });
  },

  moveToken: (tokenId: string, position: number) => {
    const { players, currentTurn, diceValue } = get();
    
    const player = players[currentTurn];
    if (!player) return;

    const updatedPlayers = { ...players };
    const tokenIndex = player.tokens.findIndex(t => t.id === tokenId);
    
    if (tokenIndex === -1) return;

    // Update token position
    updatedPlayers[currentTurn]!.tokens[tokenIndex].position = position;

    // Check if all tokens are finished
    const allTokensFinished = player.tokens.every(t => t.isFinished);
    
    if (allTokensFinished) {
      set({
        players: updatedPlayers,
        isGameOver: true,
        winner: currentTurn,
      });
      return;
    }

    // Move to next turn if dice value is not 6
    const nextTurn = diceValue === 6 ? currentTurn : 
      currentTurn === 'red' ? 'green' : 'red';

    set({
      players: updatedPlayers,
      currentTurn: nextTurn,
      diceValue: null,
      selectedToken: null,
      validMoves: [],
    });
  },

  resign: () => {
    const { currentTurn } = get();
    set({
      isGameOver: true,
      winner: currentTurn === 'red' ? 'green' : 'red',
    });
  },
}));