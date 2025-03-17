import { Chess, type Square } from 'chess.js';
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from './firebase';
import { GameHistoryManager } from './game-history';
import { calculateEloChange, getNewRating } from './elo';
import type { Player } from './store';

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  lastMove: { from: Square; to: Square } | null;
  timeLeft: { white: number; black: number };
  isGameOver: boolean;
  winner: 'w' | 'b' | 'd' | null;
  drawOffer: { offeredBy: string; timestamp: number } | null;
  players: {
    white: Player | null;
    black: Player | null;
  };
  moves: string[];
}

export class GameStateManager {
  private gameId: string;
  private game: Chess;
  private stateRef: any;
  private onStateChange: (state: GameState) => void;
  private moves: string[] = [];

  constructor(gameId: string, onStateChange: (state: GameState) => void) {
    this.gameId = gameId;
    this.game = new Chess();
    this.onStateChange = onStateChange;
    this.setupRealtimeSync();
  }

  private setupRealtimeSync() {
    this.stateRef = ref(rtdb, `games/${this.gameId}/state`);
    
    onValue(this.stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        this.game.load(state.fen);
        this.moves = state.moves || [];
        this.onStateChange(state);
      }
    });
  }

  async makeMove(from: Square, to: Square) {
    try {
      const move = this.game.move({ from, to, promotion: 'q' });
      if (move) {
        this.moves.push(`${from}${to}`);
        
        const state: GameState = {
          fen: this.game.fen(),
          turn: this.game.turn(),
          lastMove: { from, to },
          timeLeft: { white: 0, black: 0 }, // Updated by timer
          isGameOver: this.game.isGameOver(),
          winner: this.game.isCheckmate() ? this.game.turn() === 'w' ? 'b' : 'w' : 
                 this.game.isDraw() ? 'd' : null,
          drawOffer: null,
          players: { white: null, black: null }, // Updated separately
          moves: this.moves,
        };

        await this.updateState(state);

        // If game is over, update history and ELO
        if (state.isGameOver && state.players.white && state.players.black) {
          const historyManager = new GameHistoryManager(state.players.white.id);
          
          // Determine result
          let result: 'win' | 'loss' | 'draw';
          if (state.winner === 'd') {
            result = 'draw';
          } else {
            result = state.winner === 'w' ? 'win' : 'loss';
          }

          // Update game history
          await historyManager.addGameToHistory(
            state.players.black.id,
            'chess',
            result,
            0, // stake amount
            this.moves,
            state.fen
          );

          // Calculate and update ELO ratings
          const eloChange = calculateEloChange(
            state.players.white.elo,
            state.players.black.elo,
            result
          );

          // Update players' ratings in the database
          // This would typically be handled by a separate rating manager
          console.log('ELO change:', eloChange);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }

  async updateState(state: Partial<GameState>) {
    await set(this.stateRef, state);
  }

  async offerDraw(playerId: string) {
    await this.updateState({
      drawOffer: {
        offeredBy: playerId,
        timestamp: Date.now(),
      },
    });
  }

  async acceptDraw() {
    await this.updateState({
      isGameOver: true,
      winner: 'd',
      drawOffer: null,
    });
  }

  async rejectDraw() {
    await this.updateState({
      drawOffer: null,
    });
  }

  async resign(color: 'w' | 'b') {
    await this.updateState({
      isGameOver: true,
      winner: color === 'w' ? 'b' : 'w',
    });
  }

  cleanup() {
    // Clean up Firebase listeners
    if (this.stateRef) {
      // Unsubscribe from real-time updates
    }
  }
}