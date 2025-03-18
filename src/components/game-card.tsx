import { motion } from 'framer-motion';
import { HelpCircle, PlayCircle, Trophy, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface GameCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  category: string;
  players: string;
  prize: string;
  rules: string;
  className?: string;
}

export function GameCard({
  id,
  title,
  icon: Icon,
  category,
  players,
  prize,
  rules,
  className,
}: GameCardProps) {
  const [showRules, setShowRules] = useState(false);
  const navigate = useNavigate();

  const handleGameStart = (mode: 'demo' | 'live') => {
    navigate(`/game/${id}?mode=${mode}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-xl',
        'transition-all duration-300 hover:bg-white/20',
        'border border-white/10 shadow-xl',
        className
      )}
    >
      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'rounded-xl bg-gradient-to-br from-white/20 to-white/5 p-3',
            'shadow-lg transition-transform duration-300',
            'group-hover:scale-110 group-hover:shadow-purple-500/20',
            'relative before:absolute before:inset-0 before:rounded-xl',
            'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
            'before:opacity-0 before:transition-opacity before:duration-300',
            'group-hover:before:opacity-100'
          )}>
            <Icon className={cn(
              'h-8 w-8 transition-all duration-300',
              'text-purple-400 group-hover:text-purple-300',
              'drop-shadow-[0_2px_4px_rgba(168,85,247,0.4)]',
              'group-hover:drop-shadow-[0_4px_8px_rgba(168,85,247,0.6)]'
            )} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/60">{players}</p>
          </div>
        </div>
        <button
          onClick={() => setShowRules(!showRules)}
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
        >
          <HelpCircle className="h-5 w-5 text-white" />
        </button>
      </div>

      {showRules && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-lg bg-white/5 p-3 text-sm text-white/80"
        >
          {rules}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {category}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Trophy size={12} className="text-yellow-400" />
          {prize}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleGameStart('demo')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <PlayCircle size={16} />
          Demo
        </button>
        <button
          onClick={() => handleGameStart('live')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <PlayCircle size={16} />
          Play Live
        </button>
      </div>
    </motion.div>
  );
}