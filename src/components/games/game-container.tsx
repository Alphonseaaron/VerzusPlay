import { motion } from 'framer-motion';
import { ChessBoard } from '../chess/board';
import { GameControls } from '../chess/controls';
import { Scoreboard } from '../chess/scoreboard';
import { CheckersBoard } from '../checkers/board';
import { CheckersControls } from '../checkers/controls';
import { CheckersScoreboard } from '../checkers/scoreboard';
import { useGameStore } from '../../lib/store';
import { useCheckersStore } from '../../lib/checkers';
import { useEffect } from 'react';

interface GameContainerProps {
  gameId: string;
  mode: 'demo' | 'live';
  type: 'ranked' | 'tournament' | 'casual' | 'computer';
  stake: number;
}

export function GameContainer({ gameId, mode, type, stake }: GameContainerProps) {
  const initChessGame = useGameStore((state) => state.initGame);
  const initCheckersGame = useCheckersStore((state) => state.initGame);

  useEffect(() => {
    switch (gameId) {
      case 'chess':
        initChessGame(mode, type, stake);
        break;
      case 'checkers':
        initCheckersGame(mode, type, stake);
        break;
    }
  }, [gameId, mode, type, stake, initChessGame, initCheckersGame]);

  switch (gameId) {
    case 'chess':
      return (
        <>
          <Scoreboard />
          <ChessBoard />
          <GameControls />
        </>
      );
    case 'checkers':
      return (
        <>
          <CheckersScoreboard />
          <CheckersBoard />
          <CheckersControls />
        </>
      );
    default:
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-[16/9] overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl"
        >
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-white/60">
              {gameId === 'pool' && 'Pool game coming soon...'}
              {gameId === 'snake' && 'Snake game coming soon...'}
              {gameId === 'tetris' && 'Tetris game coming soon...'}
              {!['pool', 'snake', 'tetris'].includes(gameId) && 'Game interface will be loaded here'}
            </p>
          </div>
        </motion.div>
      );
  }
}