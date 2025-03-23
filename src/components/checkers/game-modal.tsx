import { motion } from 'framer-motion';
import { Bot, Trophy, Users, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AvailableGame {
  id: string;
  creator: string;
  stake: number;
  createdAt: string;
}

interface Friend {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'in_game';
  avatar?: string;
}

export function CheckersGameModal({ isOpen, onClose }: GameModalProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const { user } = useAuth();
  const [stake, setStake] = useState('');
  const [showStakeInput, setShowStakeInput] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'create' | 'join' | 'invite' | 'computer' | null>(null);
  const [availableGames] = useState<AvailableGame[]>([
    { id: '1', creator: 'Player1', stake: 10, createdAt: new Date().toISOString() },
    { id: '2', creator: 'Player2', stake: 25, createdAt: new Date().toISOString() },
  ]);
  const [friends] = useState<Friend[]>([
    { id: '1', username: 'Friend1', status: 'online' },
    { id: '2', username: 'Friend2', status: 'offline' },
    { id: '3', username: 'Friend3', status: 'in_game' },
  ]);

  const handleCreateGame = () => {
    if (mode === 'live') {
      if (!stake) {
        toast.error('Please enter a stake amount');
        return;
      }
      toast.success('Game created successfully! Waiting for opponent...');
      navigate(`/game/checkers?mode=live&type=create&stake=${stake}`);
    } else {
      toast.success('Game created successfully! Waiting for opponent...');
      navigate(`/game/checkers?mode=demo&type=create&stake=10`);
    }
    onClose();
  };

  const handleJoinGame = (game: AvailableGame) => {
    if (mode === 'live') {
      toast.success('Joining game...');
      navigate(`/game/checkers?mode=live&type=join&stake=${game.stake}`);
    } else {
      toast.success('Joining game...');
      navigate(`/game/checkers?mode=demo&type=join&stake=${game.stake}`);
    }
    onClose();
  };

  const handleInviteFriend = (friend: Friend) => {
    if (mode === 'live') {
      if (!stake) {
        toast.error('Please enter a stake amount');
        return;
      }
      toast.success(`Invitation sent to ${friend.username}`);
      navigate(`/game/checkers?mode=live&type=invite&stake=${stake}`);
    } else {
      toast.success(`Invitation sent to ${friend.username}`);
      navigate(`/game/checkers?mode=demo&type=invite&stake=10`);
    }
    onClose();
  };

  const handleComputerGame = () => {
    if (mode === 'live') {
      if (!stake) {
        toast.error('Please enter a stake amount');
        return;
      }
      toast.success('Starting game against computer...');
      navigate(`/game/checkers?mode=live&type=computer&stake=${stake}`);
    } else {
      toast.success('Starting game against computer...');
      navigate(`/game/checkers?mode=demo&type=computer&stake=10`);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedMode(null);
    setStake('');
    setShowStakeInput(false);
    onClose();
    navigate('/games');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl bg-white/10 p-6 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-white">Choose Game Mode</h2>

        <div className="mb-6 grid gap-4">
          <button
            onClick={() => {
              if (mode === 'live') {
                setSelectedMode('create');
                setShowStakeInput(true);
              } else {
                handleCreateGame();
              }
            }}
            className={cn(
              'flex items-center gap-3 rounded-xl p-4',
              'transition-colors duration-200',
              selectedMode === 'create'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <Plus className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Create Match</h3>
              <p className="text-sm opacity-80">Create a new game and wait for opponents</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (mode === 'live') {
                setSelectedMode('join');
                setShowStakeInput(false);
              } else {
                setSelectedMode('join');
              }
            }}
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
            onClick={() => {
              if (mode === 'live') {
                setSelectedMode('invite');
                setShowStakeInput(true);
              } else {
                setSelectedMode('invite');
              }
            }}
            className={cn(
              'flex items-center gap-3 rounded-xl p-4',
              'transition-colors duration-200',
              selectedMode === 'invite'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <UserPlus className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Invite an Opponent</h3>
              <p className="text-sm opacity-80">Challenge a friend to play</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (mode === 'live') {
                setSelectedMode('computer');
                setShowStakeInput(true);
              } else {
                handleComputerGame();
              }
            }}
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

        {mode === 'live' && showStakeInput && (
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

        {selectedMode === 'join' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 max-h-64 space-y-2 overflow-y-auto"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">Available Games</h3>
            {availableGames.map((game) => (
              <button
                key={game.id}
                onClick={() => handleJoinGame(game)}
                className="flex w-full items-center justify-between rounded-lg bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <div>
                  <p className="font-medium">{game.creator}</p>
                  <p className="text-sm text-white/60">Created {new Date(game.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${game.stake}</p>
                  <p className="text-sm text-white/60">Stake</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {selectedMode === 'invite' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 max-h-64 space-y-2 overflow-y-auto"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">Friends</h3>
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleInviteFriend(friend)}
                className="flex w-full items-center justify-between rounded-lg bg-white/10 p-4 text-white hover:bg-white/20"
                disabled={friend.status === 'offline'}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-purple-600">
                      {friend.avatar ? (
                        <img src={friend.avatar} alt={friend.username} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white">
                          {friend.username[0]}
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white/10',
                      friend.status === 'online' ? 'bg-green-500' :
                      friend.status === 'in_game' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">{friend.username}</p>
                    <p className="text-sm capitalize text-white/60">{friend.status}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {mode === 'live' && (
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
              Cancel
            </button>
            {selectedMode === 'create' && (
              <button
                onClick={handleCreateGame}
                disabled={!stake}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 font-medium transition-colors',
                  stake ? 'bg-purple-600 text-white hover:bg-purple-700' :
                  'cursor-not-allowed bg-white/10 text-white/50'
                )}
              >
                Create Game
              </button>
            )}
            {selectedMode === 'computer' && (
              <button
                onClick={handleComputerGame}
                disabled={!stake}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 font-medium transition-colors',
                  stake ? 'bg-purple-600 text-white hover:bg-purple-700' :
                  'cursor-not-allowed bg-white/10 text-white/50'
                )}
              >
                Start Game
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}