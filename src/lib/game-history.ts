import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { GameHistory } from './firebase';

export class GameHistoryManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async addGameToHistory(
    opponentId: string,
    gameType: string,
    result: 'win' | 'loss' | 'draw',
    stakeAmount: number,
    moves: string[],
    finalPosition: string
  ): Promise<void> {
    const gameHistory: GameHistory = {
      id: crypto.randomUUID(),
      playerId: this.userId,
      opponentId,
      gameType,
      result,
      stakeAmount,
      moves,
      finalPosition,
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'gameHistory'), gameHistory);
  }

  async getGameHistory(): Promise<GameHistory[]> {
    const historyQuery = query(
      collection(db, 'gameHistory'),
      where('playerId', '==', this.userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(historyQuery);
    return snapshot.docs.map(doc => doc.data() as GameHistory);
  }

  async getWinLossRatio(gameType?: string): Promise<{
    wins: number;
    losses: number;
    draws: number;
    ratio: number;
  }> {
    let historyQuery = query(
      collection(db, 'gameHistory'),
      where('playerId', '==', this.userId)
    );

    if (gameType) {
      historyQuery = query(historyQuery, where('gameType', '==', gameType));
    }

    const snapshot = await getDocs(historyQuery);
    const games = snapshot.docs.map(doc => doc.data() as GameHistory);

    const stats = games.reduce(
      (acc, game) => {
        acc[game.result]++;
        return acc;
      },
      { win: 0, loss: 0, draw: 0 }
    );

    const totalGames = stats.win + stats.loss + stats.draw;
    const ratio = totalGames > 0 ? stats.win / totalGames : 0;

    return {
      wins: stats.win,
      losses: stats.loss,
      draws: stats.draw,
      ratio,
    };
  }
}