import { motion } from 'framer-motion';
import { useCheckersStore } from '../../lib/checkers';
import type { Position } from '../../lib/checkers';
import { cn } from '../../lib/utils';

interface CheckersPieceProps {
  color: 'red' | 'black';
  isKing: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function CheckersPiece({ color, isKing, isSelected, onClick }: CheckersPieceProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'aspect-square w-[80%] cursor-pointer rounded-full border-4',
        'transition-all duration-200',
        color === 'red' 
          ? 'border-red-300 bg-red-600' 
          : 'border-gray-700 bg-gray-900',
        isSelected && 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent'
      )}
    >
      {isKing && (
        <div className="flex h-full items-center justify-center">
          <div className={cn(
            'text-2xl font-bold',
            color === 'red' ? 'text-red-300' : 'text-gray-700'
          )}>
            ♔
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface CheckersSquareProps {
  position: Position;
  isDark: boolean;
  isValidMove: boolean;
  children?: React.ReactNode;
}

function CheckersSquare({ position, isDark, isValidMove, children }: CheckersSquareProps) {
  const makeMove = useCheckersStore(state => state.makeMove);
  const selectedPiece = useCheckersStore(state => state.selectedPiece);

  const handleClick = () => {
    if (isValidMove && selectedPiece) {
      makeMove(selectedPiece, position);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative aspect-square transition-colors',
        isDark ? 'bg-purple-900/50' : 'bg-purple-700/30',
        isValidMove && 'ring-2 ring-green-400'
      )}
    >
      <div className="flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function CheckersBoard() {
  const board = useCheckersStore(state => state.board);
  const selectedPiece = useCheckersStore(state => state.selectedPiece);
  const validMoves = useCheckersStore(state => state.validMoves);
  const selectPiece = useCheckersStore(state => state.selectPiece);
  const turn = useCheckersStore(state => state.turn);
  const matchType = useCheckersStore(state => state.matchType);

  const isValidMove = (position: Position) => {
    return validMoves.some(move => move.row === position.row && move.col === position.col);
  };

  const isSelected = (position: Position) => {
    return selectedPiece?.row === position.row && selectedPiece?.col === position.col;
  };

  return (
    <div className="aspect-square w-full max-w-2xl overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-xl">
      <div className="grid aspect-square grid-cols-8 gap-1">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isDark = (rowIndex + colIndex) % 2 === 1;

            return (
              <CheckersSquare
                key={`${rowIndex}-${colIndex}`}
                position={position}
                isDark={isDark}
                isValidMove={isValidMove(position)}
              >
                {piece && (
                  <CheckersPiece
                    color={piece.color}
                    isKing={piece.isKing}
                    isSelected={isSelected(position)}
                    onClick={() => {
                      // Only allow selection if it's the player's turn
                      if (
                        piece.color === turn &&
                        !(matchType === 'computer' && piece.color === 'black')
                      ) {
                        selectPiece(position);
                      }
                    }}
                  />
                )}
              </CheckersSquare>
            );
          })
        )}
      </div>
    </div>
  );
}