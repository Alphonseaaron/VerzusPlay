import { motion } from 'framer-motion';
import { Flag, HandshakeIcon, Undo2 } from 'lucide-react';
import { useGameStore } from '../../lib/store';
import { cn } from '../../lib/utils';

export function GameControls() {
  const { resign, offerDraw, requestUndo } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex items-center justify-center gap-4"
    >
      <button
        onClick={requestUndo}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2',
          'bg-white/10 text-white transition-colors hover:bg-white/20'
        )}
      >
        <Undo2 className="h-5 w-5" />
        Request Undo
      </button>

      <button
        onClick={offerDraw}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2',
          'bg-white/10 text-white transition-colors hover:bg-white/20'
        )}
      >
        <HandshakeIcon className="h-5 w-5" />
        Offer Draw
      </button>

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