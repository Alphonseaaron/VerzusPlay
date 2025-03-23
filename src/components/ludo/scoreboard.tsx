import { Trophy } from 'lucide-react';
import { useLudoStore, type PlayerColor } from '../../lib/ludo';
import { cn } from '../../lib/utils';

interface PlayerInfoProps {
  color: PlayerColor;
  username: string;
  elo: number;
  isActive: boolean;
}

function PlayerInfo({ color, username, elo, isActive }: PlayerInfoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-xl',
        isActive && 'ring-2 ring-yellow-400'
      )}
    >
      <div className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full',
        color === 'red' && 'bg-red-600',
        color === 'green' && 'bg-green-600',
        color === 'yellow' && 'bg-yellow-600',
        color === 'blue' && 'bg-blue-600'
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

export function LudoScoreboard() {
  const { players, currentTurn, gameMode, matchType, stake } = useLudoStore();

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between gap-8">
        <PlayerInfo
          color="red"
          username={players.red?.username || 'Waiting...'}
          elo={players.red?.elo || 0}
          isActive={currentTurn === 'red'}
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
          color="green"
          username={players.green?.username || 'Waiting...'}
          elo={players.green?.elo || 0}
          isActive={currentTurn === 'green'}
        />
      </div>
    </div>
  );
}