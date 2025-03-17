import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { GameStateManager, type GameState } from '../lib/game-state';
import { MatchmakingManager } from '../lib/matchmaking';

export function useGame(gameId: string) {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStateManager, setGameStateManager] = useState<GameStateManager | null>(null);
  const [matchmaking, setMatchmaking] = useState<MatchmakingManager | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const manager = new GameStateManager(gameId, (state) => {
      setGameState(state);
    });

    const matchmakingManager = new MatchmakingManager(user.uid);

    setGameStateManager(manager);
    setMatchmaking(matchmakingManager);

    return () => {
      manager.cleanup();
      matchmakingManager.cleanup();
    };
  }, [gameId, user]);

  const findMatch = async (gameType: string, stake: number, eloRating: number) => {
    if (!matchmaking) return;

    try {
      const requestId = await matchmaking.findMatch(gameType, stake, eloRating);
      
      matchmaking.listenToMatchRequest(requestId, (matchId) => {
        // Handle successful match
        matchmaking.listenToMatch(matchId, (state) => {
          setGameState(state);
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find match');
    }
  };

  const makeMove = async (from: string, to: string) => {
    if (!gameStateManager) return;

    try {
      await gameStateManager.makeMove(from as any, to as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid move');
    }
  };

  const offerDraw = async () => {
    if (!gameStateManager || !user) return;
    await gameStateManager.offerDraw(user.uid);
  };

  const handleDraw = async (accept: boolean) => {
    if (!gameStateManager) return;
    
    if (accept) {
      await gameStateManager.acceptDraw();
    } else {
      await gameStateManager.rejectDraw();
    }
  };

  const resign = async (color: 'w' | 'b') => {
    if (!gameStateManager) return;
    await gameStateManager.resign(color);
  };

  return {
    gameState,
    error,
    findMatch,
    makeMove,
    offerDraw,
    handleDraw,
    resign,
  };
}