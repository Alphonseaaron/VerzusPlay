import { io, type Socket } from 'socket.io-client';
import { type Square } from 'chess.js';
import { type Player } from './store';
import { rtdb } from './firebase';
import { ref, onValue, set, push } from 'firebase/database';

interface GameState {
  fen: string;
  lastMove: { from: Square; to: Square } | null;
  timeLeft: { white: number; black: number };
}

interface GameOptions {
  gameId: string;
  playerId: string;
  gameType: 'ranked' | 'tournament' | 'casual';
  stake?: number;
}

export class MultiplayerManager {
  private socket: Socket;
  private gameState: GameState | null = null;
  private options: GameOptions | null = null;
  private gameRef: any;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('gameState', (state: GameState) => {
      this.gameState = state;
      if (this.options) {
        set(ref(rtdb, `games/${this.options.gameId}/state`), state);
      }
    });

    this.socket.on('playerJoined', (player: Player) => {
      if (this.options) {
        push(ref(rtdb, `games/${this.options.gameId}/players`), player);
      }
    });

    this.socket.on('playerLeft', (playerId: string) => {
      if (this.options) {
        // Handle player disconnection in Firebase
      }
    });

    this.socket.on('gameOver', (result: { winner: string; reason: string }) => {
      if (this.options) {
        set(ref(rtdb, `games/${this.options.gameId}/result`), result);
      }
    });
  }

  joinGame(options: GameOptions) {
    this.options = options;
    this.gameRef = ref(rtdb, `games/${options.gameId}`);
    
    // Listen for real-time game updates
    onValue(this.gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update local game state
        this.gameState = data.state;
      }
    });

    this.socket.emit('joinGame', options);
  }

  makeMove(from: Square, to: Square) {
    if (!this.options) return;

    const move = { from, to };
    set(ref(rtdb, `games/${this.options.gameId}/moves`), move);
    this.socket.emit('makeMove', {
      gameId: this.options.gameId,
      move,
    });
  }

  offerDraw() {
    if (!this.options) return;
    set(ref(rtdb, `games/${this.options.gameId}/drawOffer`), {
      offeredBy: this.options.playerId,
      timestamp: Date.now(),
    });
    this.socket.emit('offerDraw', { gameId: this.options.gameId });
  }

  respondToDraw(accept: boolean) {
    if (!this.options) return;
    set(ref(rtdb, `games/${this.options.gameId}/drawResponse`), {
      accepted: accept,
      respondedBy: this.options.playerId,
      timestamp: Date.now(),
    });
    this.socket.emit('respondToDraw', {
      gameId: this.options.gameId,
      accept,
    });
  }

  disconnect() {
    if (this.gameRef) {
      // Clean up Firebase listeners
    }
    this.socket.disconnect();
  }
}