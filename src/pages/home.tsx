import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GameCard } from '../components/game-card';
import { ALL_GAMES } from '../components/game-grid';

const FEATURED_TOURNAMENTS = [
  {
    title: 'Weekly Chess Championship',
    prize: '$1,000',
    entryFee: '$10',
    players: '128',
    endsIn: '5 days',
  },
  {
    title: 'Daily Pool Tournament',
    prize: '$500',
    entryFee: '$5',
    players: '64',
    endsIn: '12 hours',
  },
  {
    title: 'Monthly Tetris Masters',
    prize: '$2,500',
    entryFee: '$25',
    players: '256',
    endsIn: '18 days',
  },
];

const TOP_PLAYERS = [
  {
    name: 'Magnus C.',
    game: 'Chess Masters',
    rank: '#1',
    winnings: '$12,450',
  },
  {
    name: 'Sarah K.',
    game: '8-Ball Pool',
    rank: '#1',
    winnings: '$8,920',
  },
  {
    name: 'Alex T.',
    game: 'Tetris Masters',
    rank: '#1',
    winnings: '$7,845',
  },
];

const MOST_PLAYED = ALL_GAMES.slice(0, 3);

export function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          Play, Compete, Win
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/60">
          Join the ultimate gaming platform with 20+ competitive games. Showcase your skills,
          challenge players worldwide, and win real money prizes.
        </p>
      </motion.div>

      {/* Featured Tournaments */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Featured Tournaments</h3>
          <Link
            to="/tournaments"
            className="text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            View All
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOURNAMENTS.map((tournament) => (
            <motion.div
              key={tournament.title}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white/10 p-6 backdrop-blur-xl"
            >
              <h4 className="mb-2 text-lg font-semibold text-white">{tournament.title}</h4>
              <div className="mb-4 space-y-1 text-sm text-white/60">
                <p>Prize Pool: <span className="text-purple-400">{tournament.prize}</span></p>
                <p>Entry Fee: {tournament.entryFee}</p>
                <p>Players: {tournament.players}</p>
                <p>Ends in: {tournament.endsIn}</p>
              </div>
              <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                Join Tournament
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Most Played Games */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Most Played Games</h3>
          <Link
            to="/games"
            className="text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            View All
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOST_PLAYED.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </section>

      {/* Top Players */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Top Players</h3>
          <Link
            to="/leaderboard"
            className="text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            View All
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_PLAYERS.map((player) => (
            <motion.div
              key={player.name}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 rounded-xl bg-white/10 p-6 backdrop-blur-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{player.name}</h4>
                <p className="text-sm text-white/60">{player.game}</p>
                <p className="mt-1">
                  <span className="text-yellow-400">{player.rank}</span>
                  <span className="ml-2 text-green-400">{player.winnings}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}