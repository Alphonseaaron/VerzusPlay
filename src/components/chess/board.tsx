import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { type Square } from 'chess.js';
import { useGameStore } from '../../lib/store';
import { ChessPiece } from './piece';
import { ChessSquare } from './square';

const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function ChessBoard() {
  const { game, selectedSquare, validMoves, makeMove, selectSquare, matchType, turn } = useGameStore();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const from = active.id as Square;
    const to = over.id as Square;

    makeMove(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <div className="aspect-square w-full max-w-2xl overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-xl">
        <div className="grid aspect-square grid-cols-8 gap-1">
          {RANKS.map((rank) =>
            FILES.map((file) => {
              const square = `${file}${rank}` as Square;
              const piece = game.get(square);
              const isSelected = selectedSquare === square;
              const isValidMove = validMoves.includes(square);
              const isDark = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 1;

              return (
                <ChessSquare
                  key={square}
                  square={square}
                  isDark={isDark}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  onClick={() => selectSquare(square)}
                >
                  {piece && (
                    <ChessPiece
                      id={square}
                      type={piece.type}
                      color={piece.color}
                      isDraggable={
                        piece.color === turn &&
                        !(matchType === 'computer' && piece.color === 'b')
                      }
                    />
                  )}
                </ChessSquare>
              );
            })
          )}
        </div>
      </div>
    </DndContext>
  );
}