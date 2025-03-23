import { motion } from 'framer-motion';
import { Dice3, Flag } from 'lucide-react';
import { useLudoStore } from '../../lib/ludo';
import { cn } from '../../lib/utils';

export function LudoControls() {
  const { diceValue, isRolling, rollDice, resign } = useLudoStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex items-center justify-center gap-4"
    >
      <button
        onClick={rollDice}
        disabled={isRolling}
        className={cn(
          'flex items-center gap-2 rounded-lg px-6 py-3',
          'bg-purple-600 text-white transition-colors hover:bg-purple-700',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        <Dice3 className={cn(
          'h-6 w-6',
          isRolling && 'animate-spin'
        )} />
        {isRolling ? 'Rolling...' : diceValue ? `Rolled: ${diceValue}` : 'Roll Dice'}
      </button>

      <button
        onClick={resign}
        className={cn(
          'flex items-center gap-2 rounded-lg px-6 py-3',
          'bg-red-600 text-white transition-colors hover:bg-red-700'
        )}
      >
        <Flag className="h-6 w-6" />
        Resign
      </button>
    </motion.div>
  );
}