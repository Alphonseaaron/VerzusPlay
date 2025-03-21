import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  DollarSign,
  Gamepad2,
  Trophy,
  Users,
  Crown,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { TournamentManager } from '../lib/tournaments';
import { ALL_GAMES } from '../components/game-grid';
import type { Tournament } from '../lib/firebase';
import { cn } from '../lib/utils';

interface TournamentPool {
  id: string;
  gameId: string;
  entryFee: number;
  currentPlayers: number;
  maxPlayers: number;
  status: 'filling' | 'running' | 'completed';
  prizePool: number;
  startTime?: string;
}

const ENTRY_FEES = [2, 5, 10];
const PLAYERS_PER_TOURNAMENT = 5;
const HOUSE_CUT_PERCENTAGE = 20;

export function TournamentsPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activePools, setActivePools] = useState<TournamentPool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    const loadTournaments = async () => {
      if (!user) {
        // Generate demo pools for non-authenticated users
        const pools: TournamentPool[] = [];
        ENTRY_FEES.forEach(fee => {
          ALL_GAMES.forEach(game => {
            const players = Math.floor(Math.random() * PLAYERS_PER_TOURNAMENT);
            pools.push({
              id: crypto.randomUUID(),
              gameId: game.id,
              entryFee: fee,
              currentPlayers: players,
              maxPlayers: PLAYERS_PER_TOURNAMENT,
              status: players === PLAYERS_PER_TOURNAMENT ? 'running' : 'filling',
              prizePool: fee * PLAYERS_PER_TOURNAMENT * (1 - HOUSE_CUT_PERCENTAGE / 100),
              startTime: players === PLAYERS_PER_TOURNAMENT ? new Date().toISOString() : undefined,
            });
          });
        });
        setActivePools(pools);
        return;
      }

      setIsLoading(true);
      try {
        const tournamentManager = new TournamentManager(user.uid);
        const activeTournaments = await tournamentManager.getActiveTournaments();
        setTournaments(activeTournaments);

        // Generate active pools
        const pools: TournamentPool[] = [];
        ENTRY_FEES.forEach(fee => {
          ALL_GAMES.forEach(game => {
            const players = Math.floor(Math.random() * PLAYERS_PER_TOURNAMENT);
            pools.push({
              id: crypto.randomUUID(),
              gameId: game.id,
              entryFee: fee,
              currentPlayers: players,
              maxPlayers: PLAYERS_PER_TOURNAMENT,
              status: players === PLAYERS_PER_TOURNAMENT ? 'running' : 'filling',
              prizePool: fee * PLAYERS_PER_TOURNAMENT * (1 - HOUSE_CUT_PERCENTAGE / 100),
              startTime: players === PLAYERS_PER_TOURNAMENT ? new Date().toISOString() : undefined,
            });
          });
        });
        setActivePools(pools);
      } catch (err) {
        setError('Failed to load tournaments');
      } finally {
        setIsLoading(false);
      }
    };

    loadTournaments();
  }, [user]);

  const handleJoinTournament = async (pool: TournamentPool) => {
    if (!user) {
      setError('Please sign in to join tournaments');
      return;
    }

    setError('');
    try {
      // Simulate joining tournament
      const updatedPools = activePools.map(p => {
        if (p.id === pool.id) {
          const newPlayerCount = p.currentPlayers + 1;
          return {
            ...p,
            currentPlayers: newPlayerCount,
            status: newPlayerCount === PLAYERS_PER_TOURNAMENT ? 'running' : 'filling',
            startTime: newPlayerCount === PLAYERS_PER_TOURNAMENT ? new Date().toISOString() : undefined,
          };
        }
        return p;
      });

      // If pool is full, create a new one
      if (pool.currentPlayers + 1 === PLAYERS_PER_TOURNAMENT) {
        updatedPools.push({
          id: crypto.randomUUID(),
          gameId: pool.gameId,
          entryFee: pool.entryFee,
          currentPlayers: 0,
          maxPlayers: PLAYERS_PER_TOURNAMENT,
          status: 'filling',
          prizePool: pool.entryFee * PLAYERS_PER_TOURNAMENT * (1 - HOUSE_CUT_PERCENTAGE / 100),
        });
      }

      setActivePools(updatedPools);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join tournament');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="mb-4 text-4xl font-bold text-white">Tournaments</h2>
        <p className="mx-auto max-w-2xl text-lg text-white/60">
          Join fast-paced tournaments with instant rewards. Play, win, and rejoin immediately!
        </p>
      </motion.div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-2xl rounded-xl bg-purple-600/20 p-6 text-center backdrop-blur-xl"
        >
          <LogIn className="mx-auto mb-4 h-8 w-8 text-purple-400" />
          <h3 className="mb-2 text-lg font-semibold text-white">Sign In to Join Tournaments</h3>
          <p className="text-white/60">
            Create an account or sign in to participate in tournaments and win real prizes!
          </p>
        </motion.div>
      )}

      {/* Tournament Pools */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_GAMES.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl"
          >
            <div className="border-b border-white/10 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-purple-600 p-3">
                  <game.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                  <p className="text-sm text-white/60">{game.category}</p>
                </div>
              </div>

              {/* Tournament Pools */}
              <div className="space-y-4">
                {ENTRY_FEES.map(fee => {
                  const pool = activePools.find(p => 
                    p.gameId === game.id && 
                    p.entryFee === fee && 
                    p.status === 'filling'
                  );

                  if (!pool) return null;

                  const prizePool = fee * PLAYERS_PER_TOURNAMENT;
                  const houseCut = prizePool * (HOUSE_CUT_PERCENTAGE / 100);
                  const winnerPrize = prizePool - houseCut;

                  return (
                    <div
                      key={`${game.id}-${fee}`}
                      className="rounded-lg bg-white/10 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">
                          ${fee} Tournament
                        </span>
                        <span className="text-sm text-green-400">
                          Win ${winnerPrize}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center justify-between text-sm text-white/60">
                        <span>
                          {pool.currentPlayers}/{pool.maxPlayers} Players
                        </span>
                        <span>
                          {pool.maxPlayers - pool.currentPlayers} slots left
                        </span>
                      </div>
                      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{
                            width: `${(pool.currentPlayers / pool.maxPlayers) * 100}%`
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleJoinTournament(pool)}
                        className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                      >
                        Join for ${fee}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Tournaments */}
            <div className="space-y-2 p-6">
              <h4 className="font-medium text-white">Active Tournaments</h4>
              {activePools
                .filter(p => p.gameId === game.id && p.status === 'running')
                .map(pool => (
                  <div
                    key={pool.id}
                    className="rounded-lg bg-white/10 p-4 text-sm text-white/80"
                  >
                    <div className="flex items-center justify-between">
                      <span>${pool.entryFee} Tournament</span>
                      <span>Prize: ${pool.prizePool}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Started {format(new Date(pool.startTime!), 'HH:mm:ss')}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tournament Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white/10 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Daily Stats
          </h3>
          <div className="space-y-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Total Tournaments</span>
              <span>247</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Prize Pool Distributed</span>
              <span>$12,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Players</span>
              <span>1,234</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Your Stats
          </h3>
          <div className="space-y-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Tournaments Played</span>
              <span>{user ? '12' : '---'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tournaments Won</span>
              <span>{user ? '3' : '---'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Earnings</span>
              <span>{user ? '$145' : '---'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Weekly Leaderboard
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-white/10 p-2 text-sm">
              <span className="text-yellow-400">#1</span>
              <span className="text-white">Player123</span>
              <span className="text-green-400">$1,245</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/10 p-2 text-sm">
              <span className="text-gray-400">#2</span>
              <span className="text-white">GameMaster</span>
              <span className="text-green-400">$980</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/10 p-2 text-sm">
              <span className="text-orange-400">#3</span>
              <span className="text-white">ProGamer</span>
              <span className="text-green-400">$755</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}