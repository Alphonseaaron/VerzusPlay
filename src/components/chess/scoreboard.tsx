import { Timer, Trophy } from 'lucide-react';
import { useGameStore, type Player } from '../../lib/store';
import { cn } from '../../lib/utils';

interface PlayerInfoProps {
  player: Player | null;
  timeLeft: number;
  isActive: boolean;
}

function PlayerInfo({ player, timeLeft, isActive }: PlayerInfoProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-xl',
        isActive && 'ring-2 ring-yellow-400'
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
        {player?.avatar ? (
          <img
            src={player.avatar}
            alt={player.username}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <Trophy className="h-6 w-6 text-white" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-white">
          {player?.username || 'Waiting for player...'}
        </h3>
        <p className="text-sm text-white/60">ELO: {player?.elo || '---'}</p>
        <div className="mt-1 flex items-center gap-1 text-sm">
          <Timer className="h-4 w-4 text-white/60" />
          <span className="font-mono text-white">
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Scoreboard() {
  const { players, timeLeft, turn, stake, gameMode, matchType } = useGameStore();

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between gap-8">
        <PlayerInfo
          player={players.white}
          timeLeft={timeLeft.white}
          isActive={turn === 'w'}
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
          player={players.black}
          timeLeft={timeLeft.black}
          isActive={turn === 'b'}
        />
      </div>
    </div>
  );
}