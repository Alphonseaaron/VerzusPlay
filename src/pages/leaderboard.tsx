import { motion } from 'framer-motion';

export function LeaderboardPage() {
  return (
    <div className="text-center text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        Leaderboard
      </motion.h2>
    </div>
  );
}