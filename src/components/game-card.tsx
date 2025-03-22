import { motion } from 'framer-motion';
import { HelpCircle, PlayCircle, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface GameCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  category: string;
  players: string;
  rules: string;
  className?: string;
}

export function GameCard({
  id,
  title,
  icon: Icon,
  category,
  players,
  rules,
  className,
}: GameCardProps) {
  const [showRules, setShowRules] = useState(false);
  const navigate = useNavigate();

  const handleGameStart = (mode: 'demo' | 'live') => {
    navigate(`/game/${id}?mode=${mode}`);
  };

  return (
    <div className={cn(
      'relative h-fit overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl',
      'transition-all duration-300 hover:bg-white/20',
      'border border-white/10 shadow-xl',
      className
    )}>
      <motion.div
        layout="preserve-aspect"
        className="p-4"
      >
        <motion.div layout="position" className="relative mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'rounded-xl bg-gradient-to-br from-white/20 to-white/5 p-3',
              'shadow-lg transition-transform duration-300',
              'group-hover:scale-110 group-hover:shadow-purple-500/20',
              'relative before:absolute before:inset-0 before:rounded-xl',
              'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
              'before:opacity-0 before:transition-opacity before:duration-300',
              'hover:before:opacity-100'
            )}>
              <Icon className={cn(
                'h-8 w-8 transition-all duration-300',
                'text-purple-400 hover:text-purple-300',
                'drop-shadow-[0_2px_4px_rgba(168,85,247,0.4)]',
                'hover:drop-shadow-[0_4px_8px_rgba(168,85,247,0.6)]'
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
        </motion.div>

        <motion.div
          layout="position"
          animate={{ height: showRules ? 'auto' : 0, opacity: showRules ? 1 : 0 }}
          initial={false}
          className="overflow-hidden"
        >
          <div className="mb-4 rounded-lg bg-white/5 p-3 text-sm text-white/80">
            {rules}
          </div>
        </motion.div>

        <motion.div layout="position" className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {category}
          </span>
        </motion.div>

        <motion.div layout="position" className="mt-4 flex gap-2">
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
        </motion.div>
      </motion.div>
    </div>
  );
}