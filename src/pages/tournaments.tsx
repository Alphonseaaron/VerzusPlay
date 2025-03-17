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
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { TournamentManager } from '../lib/tournaments';
import type { Tournament } from '../lib/firebase';

export function TournamentsPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const tournamentManager = new TournamentManager(user.uid);
    
    const loadTournaments = async () => {
      try {
        const activeTournaments = await tournamentManager.getActiveTournaments();
        setTournaments(activeTournaments);
      } catch (err) {
        setError('Failed to load tournaments');
      } finally {
        setIsLoading(false);
      }
    };

    loadTournaments();
  }, [user]);

  const handleJoinTournament = async (tournamentId: string) => {
    if (!user) return;

    const tournamentManager = new TournamentManager(user.uid);
    setError('');

    try {
      await tournamentManager.joinTournament(tournamentId);
      // Refresh tournaments
      const activeTournaments = await tournamentManager.getActiveTournaments();
      setTournaments(activeTournaments);
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
          Join competitive tournaments, climb the ranks, and win big prizes.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <motion.div
            key={tournament.id}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl"
          >
            <div className="border-b border-white/10 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-purple-600 p-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {tournament.name}
                  </h3>
                  <p className="text-sm text-white/60">{tournament.gameType}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Prize Pool: ${tournament.prizePool}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {tournament.participants.length} Players Registered
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Entry Fee: ${tournament.entryFee}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Starts: {format(new Date(tournament.startDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Ends: {format(new Date(tournament.endDate), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={() => handleJoinTournament(tournament.id)}
                disabled={tournament.participants.includes(user?.uid || '')}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/50"
              >
                {tournament.participants.includes(user?.uid || '')
                  ? 'Already Registered'
                  : 'Join Tournament'}
              </button>
            </div>
          </motion.div>
        ))}

        {tournaments.length === 0 && (
          <div className="col-span-full text-center text-white/60">
            No active tournaments at the moment.
          </div>
        )}
      </div>
    </div>
  );
}