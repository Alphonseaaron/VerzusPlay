import { Trophy } from 'lucide-react';
import { useCheckersStore } from '../../lib/checkers';
import { cn } from '../../lib/utils';

interface PlayerInfoProps {
  username: string;
  elo: number;
  isActive: boolean;
  color: 'red' | 'black';
}

function PlayerInfo({ username, elo, isActive, color }: PlayerInfoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-xl',
        isActive && 'ring-2 ring-yellow-400'
      )}
    >
      <div className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full',
        color === 'red' ? 'bg-red-600' : 'bg-gray-900'
      )}>
        <Trophy className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-white">{username}</h3>
        <p className="text-sm text-white/60">ELO: {elo}</p>
      </div>
    </div>
  );
}

export function CheckersScoreboard() {
  const { players, turn, gameMode, matchType, stake } = useCheckersStore();

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between gap-8">
        <PlayerInfo
          username={players.red?.username || 'Waiting...'}
          elo={players.red?.elo || 0}
          isActive={turn === 'red'}
          color="red"
        />
        <div className="text-center">
          <div className="mb-2 rounded-lg bg-purple-600 px-3 py-1 text-sm font-medium text-white">
            {gameMode === 'demo' ? 'Demo Mode' : 'Live Mode'}
          </div>
          {matchType !== 'casual' && stake > 0 && (
            <div className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white">
              Stake: ${stake}
            </div>
          )}
        </div>
        <PlayerInfo
          username={players.black?.username || 'Waiting...'}
          elo={players.black?.elo || 0}
          isActive={turn === 'black'}
          color="black"
        />
      </div>
    </div>
  );
}