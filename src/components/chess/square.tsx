import { useDroppable } from '@dnd-kit/core';
import { type Square } from 'chess.js';
import { cn } from '../../lib/utils';

interface ChessSquareProps {
  square: Square;
  isDark: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export function ChessSquare({
  square,
  isDark,
  isSelected,
  isValidMove,
  onClick,
  children,
}: ChessSquareProps) {
  const { setNodeRef } = useDroppable({
    id: square,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        'relative aspect-square transition-colors',
        isDark ? 'bg-purple-900/50' : 'bg-purple-700/30',
        isSelected && 'ring-2 ring-yellow-400',
        isValidMove && 'ring-2 ring-green-400',
        !children && isValidMove && 'after:absolute after:inset-0 after:m-auto after:h-3 after:w-3 after:rounded-full after:bg-green-400/50'
      )}
    >
      {children}
    </div>
  );
}