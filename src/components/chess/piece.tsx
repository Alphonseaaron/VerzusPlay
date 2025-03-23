import { useDraggable } from '@dnd-kit/core';
import { type Color, type PieceSymbol } from 'chess.js';
import { cn } from '../../lib/utils';

interface ChessPieceProps {
  id: string;
  type: PieceSymbol;
  color: Color;
  isDraggable?: boolean;
}

// Updated piece symbols to match the new style
const PIECE_SYMBOLS: Record<PieceSymbol, string> = {
  p: '♟︎', // Pawn with more defined shape
  n: '♞', // Knight with clearer horse head
  b: '♝', // Bishop with cross top
  r: '♜', // Rook with castle-like top
  q: '♛', // Queen with crown design
  k: '♚', // King with cross top
};

export function ChessPiece({ id, type, color, isDraggable = false }: ChessPieceProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !isDraggable,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex h-full w-full cursor-grab items-center justify-center text-4xl',
        'select-none transition-transform',
        // Updated colors to match the image style
        color === 'w' ? 'text-gray-100 drop-shadow-md' : 'text-gray-800 drop-shadow-sm',
        isDragging && 'scale-110',
        !isDraggable && 'cursor-default'
      )}
    >
      {PIECE_SYMBOLS[type]}
    </div>
  );
}