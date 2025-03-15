import { motion } from 'framer-motion';
import { GameGrid } from '../components/game-grid';

export function GamesPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="mb-4 text-4xl font-bold text-white">All Games</h2>
        <p className="mx-auto max-w-2xl text-lg text-white/60">
          Choose from our selection of competitive games and start playing now.
        </p>
      </motion.div>

      <GameGrid />
    </div>
  );
}