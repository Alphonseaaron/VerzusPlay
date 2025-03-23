import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ChessGameModal } from '../components/chess/game-modal';
import { CheckersGameModal } from '../components/checkers/game-modal';
import { LudoGameModal } from '../components/ludo/game-modal';
import { GameContainer } from '../components/games/game-container';
import { ALL_GAMES } from '../components/game-grid';

export function GamePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as 'demo' | 'live';
  const type = searchParams.get('type') as 'ranked' | 'tournament' | 'casual' | 'computer';
  const stake = parseFloat(searchParams.get('stake') || '0');
  
  const game = ALL_GAMES.find((g) => g.id === id);
  const [showRules, setShowRules] = useState(false);
  const [showModal, setShowModal] = useState(!type);

  if (!game) {
    return (
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold">Game not found</h2>
      </div>
    );
  }

  const Icon = game.icon;

  const renderGameModal = () => {
    switch (id) {
      case 'chess':
        return <ChessGameModal isOpen={showModal} onClose={() => setShowModal(false)} />;
      case 'checkers':
        return <CheckersGameModal isOpen={showModal} onClose={() => setShowModal(false)} />;
      case 'ludo':
        return <LudoGameModal isOpen={showModal} onClose={() => setShowModal(false)} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-white/20 p-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{game.title}</h2>
            <p className="text-lg text-white/60">
              {mode === 'demo' ? 'Demo Mode' : 'Live Mode'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowRules(!showRules)}
          className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
        >
          <HelpCircle className="h-6 w-6 text-white" />
        </button>
      </div>

      {showRules && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl bg-white/10 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-2 text-xl font-semibold text-white">Game Rules</h3>
          <p className="text-white/80">{game.rules}</p>
        </motion.div>
      )}

      {type ? (
        <GameContainer 
          gameId={id || ''} 
          mode={mode || 'demo'} 
          type={type} 
          stake={stake} 
        />
      ) : (
        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl">
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-white/60">Select game mode to start playing</p>
          </div>
        </div>
      )}

      {renderGameModal()}
    </div>
  );
}