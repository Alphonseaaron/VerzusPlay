import { motion } from 'framer-motion';
import { Bot, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ isOpen, onClose }: GameModalProps) {
  const navigate = useNavigate();
  const [stake, setStake] = useState('');
  const [showStakeInput, setShowStakeInput] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'join' | 'invite' | 'computer' | null>(
    null
  );

  const handleModeSelect = (mode: 'join' | 'invite' | 'computer') => {
    setSelectedMode(mode);
    setShowStakeInput(true);
  };

  const handleSubmit = () => {
    const stakeAmount = parseFloat(stake);
    if (selectedMode && (!showStakeInput || (showStakeInput && !isNaN(stakeAmount)))) {
      navigate(
        `/game/chess?mode=live&type=${selectedMode}&stake=${stakeAmount || 0}`
      );
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">Choose Game Mode</h2>

        <div className="mb-6 grid gap-4">
          <button
            onClick={() => handleModeSelect('join')}
            className={cn(
              'flex items-center gap-3 rounded-xl p-4',
              'transition-colors duration-200',
              selectedMode === 'join'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <Users className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Join a Match</h3>
              <p className="text-sm opacity-80">Find an opponent to play against</p>
            </div>
          </button>

          <button
            onClick={() => handleModeSelect('invite')}
            className={cn(
              'flex items-center gap-3 rounded-xl p-4',
              'transition-colors duration-200',
              selectedMode === 'invite'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <Trophy className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Invite an Opponent</h3>
              <p className="text-sm opacity-80">Create a match and wait for players</p>
            </div>
          </button>

          <button
            onClick={() => handleModeSelect('computer')}
            className={cn(
              'flex items-center gap-3 rounded-xl p-4',
              'transition-colors duration-200',
              selectedMode === 'computer'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <Bot className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Play Against Computer</h3>
              <p className="text-sm opacity-80">Challenge our AI opponent</p>
            </div>
          </button>
        </div>

        {showStakeInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6"
          >
            <label className="mb-2 block text-sm font-medium text-white">
              Enter Stake Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 backdrop-blur-xl"
              placeholder="Enter amount..."
            />
          </motion.div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMode || (showStakeInput && !stake)}
            className={cn(
              'flex-1 rounded-lg px-4 py-2 font-medium transition-colors',
              selectedMode && (!showStakeInput || stake)
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'cursor-not-allowed bg-white/10 text-white/50'
            )}
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}