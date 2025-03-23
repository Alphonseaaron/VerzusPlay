import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useCheckersStore } from '../../lib/checkers';
import { cn } from '../../lib/utils';

export function CheckersControls() {
  const resign = useCheckersStore(state => state.resign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex items-center justify-center"
    >
      <button
        onClick={resign}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2',
          'bg-red-600 text-white transition-colors hover:bg-red-700'
        )}
      >
        <Flag className="h-5 w-5" />
        Resign
      </button>
    </motion.div>
  );
}