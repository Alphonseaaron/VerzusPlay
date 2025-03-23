import { motion } from 'framer-motion';
import { useLudoStore, type PlayerColor } from '../../lib/ludo';
import { cn } from '../../lib/utils';

interface LudoTokenProps {
  color: PlayerColor;
  position: 'home' | 'start' | number;
  isSelected: boolean;
  onClick: () => void;
}

function LudoToken({ color, position, isSelected, onClick }: LudoTokenProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'h-8 w-8 cursor-pointer rounded-full border-2',
        'transition-all duration-200',
        color === 'red' && 'border-red-300 bg-red-600',
        color === 'green' && 'border-green-300 bg-green-600',
        color === 'yellow' && 'border-yellow-300 bg-yellow-600',
        color === 'blue' && 'border-blue-300 bg-blue-600',
        isSelected && 'ring-2 ring-purple-400 ring-offset-2'
      )}
    />
  );
}

interface LudoSquareProps {
  position: number;
  isValidMove: boolean;
  children?: React.ReactNode;
}

function LudoSquare({ position, isValidMove, children }: LudoSquareProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-lg',
        'border border-white/10 bg-white/5 transition-colors',
        isValidMove && 'ring-2 ring-green-400'
      )}
    >
      {children}
    </div>
  );
}

interface LudoHomeProps {
  color: PlayerColor;
  tokens: { id: string; position: 'home' | 'start' | number }[];
}

function LudoHome({ color, tokens }: LudoHomeProps) {
  const { currentTurn, selectedToken, selectToken } = useLudoStore();
  const isCurrentTurn = currentTurn === color;

  return (
    <div className={cn(
      'grid grid-cols-2 gap-4 rounded-xl p-4',
      color === 'red' && 'bg-red-950/30',
      color === 'green' && 'bg-green-950/30',
      color === 'yellow' && 'bg-yellow-950/30',
      color === 'blue' && 'bg-blue-950/30'
    )}>
      {tokens.map((token) => (
        token.position === 'home' && (
          <LudoToken
            key={token.id}
            color={color}
            position={token.position}
            isSelected={selectedToken === token.id}
            onClick={() => isCurrentTurn && selectToken(token.id)}
          />
        )
      ))}
    </div>
  );
}

export function LudoBoard() {
  const { players, currentTurn, validMoves, selectedToken, moveToken } = useLudoStore();

  // Create board squares
  const squares = Array(52).fill(null);

  return (
    <div className="aspect-square w-full max-w-2xl overflow-hidden rounded-xl bg-white/10 p-8 backdrop-blur-xl">
      <div className="grid grid-cols-3 gap-8">
        {/* Top row */}
        <LudoHome
          color="red"
          tokens={players.red?.tokens || []}
        />
        <div className="grid grid-cols-3 gap-2">
          {squares.slice(0, 5).map((_, index) => {
            const position = index;
            const isValidMove = validMoves.includes(position);
            const token = Object.entries(players).find(([_, player]) => 
              player?.tokens.some(t => t.position === position)
            );

            return (
              <LudoSquare
                key={position}
                position={position}
                isValidMove={isValidMove}
              >
                {token && (
                  <LudoToken
                    color={token[0] as PlayerColor}
                    position={position}
                    isSelected={selectedToken === token[1]?.tokens.find(t => t.position === position)?.id}
                    onClick={() => {
                      if (isValidMove && selectedToken) {
                        moveToken(selectedToken, position);
                      }
                    }}
                  />
                )}
              </LudoSquare>
            );
          })}
        </div>
        <LudoHome
          color="green"
          tokens={players.green?.tokens || []}
        />

        {/* Middle row */}
        <div className="grid grid-cols-3 gap-2">
          {squares.slice(39, 44).map((_, index) => {
            const position = 39 + index;
            const isValidMove = validMoves.includes(position);
            const token = Object.entries(players).find(([_, player]) => 
              player?.tokens.some(t => t.position === position)
            );

            return (
              <LudoSquare
                key={position}
                position={position}
                isValidMove={isValidMove}
              >
                {token && (
                  <LudoToken
                    color={token[0] as PlayerColor}
                    position={position}
                    isSelected={selectedToken === token[1]?.tokens.find(t => t.position === position)?.id}
                    onClick={() => {
                      if (isValidMove && selectedToken) {
                        moveToken(selectedToken, position);
                      }
                    }}
                  />
                )}
              </LudoSquare>
            );
          })}
        </div>
        <div className="flex items-center justify-center">
          <motion.div
            animate={currentTurn === 'red' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-xl bg-red-600/20 p-4 text-center"
          >
            <p className="font-medium text-white">Current Turn</p>
            <p className="text-sm text-white/60">
              {players[currentTurn]?.username || 'Waiting...'}
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {squares.slice(13, 18).map((_, index) => {
            const position = 13 + index;
            const isValidMove = validMoves.includes(position);
            const token = Object.entries(players).find(([_, player]) => 
              player?.tokens.some(t => t.position === position)
            );

            return (
              <LudoSquare
                key={position}
                position={position}
                isValidMove={isValidMove}
              >
                {token && (
                  <LudoToken
                    color={token[0] as PlayerColor}
                    position={position}
                    isSelected={selectedToken === token[1]?.tokens.find(t => t.position === position)?.id}
                    onClick={() => {
                      if (isValidMove && selectedToken) {
                        moveToken(selectedToken, position);
                      }
                    }}
                  />
                )}
              </LudoSquare>
            );
          })}
        </div>

        {/* Bottom row */}
        <LudoHome
          color="blue"
          tokens={players.blue?.tokens || []}
        />
        <div className="grid grid-cols-3 gap-2">
          {squares.slice(26, 31).map((_, index) => {
            const position = 26 + index;
            const isValidMove = validMoves.includes(position);
            const token = Object.entries(players).find(([_, player]) => 
              player?.tokens.some(t => t.position === position)
            );

            return (
              <LudoSquare
                key={position}
                position={position}
                isValidMove={isValidMove}
              >
                {token && (
                  <LudoToken
                    color={token[0] as PlayerColor}
                    position={position}
                    isSelected={selectedToken === token[1]?.tokens.find(t => t.position === position)?.id}
                    onClick={() => {
                      if (isValidMove && selectedToken) {
                        moveToken(selectedToken, position);
                      }
                    }}
                  />
                )}
              </LudoSquare>
            );
          })}
        </div>
        <LudoHome
          color="yellow"
          tokens={players.yellow?.tokens || []}
        />
      </div>
    </div>
  );
}