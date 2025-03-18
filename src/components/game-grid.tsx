import { 
  Crown,
  Dice3,
  Boxes,
  Target,
  Puzzle,
  Hexagon,
  Heart,
  Sparkles,
  Trophy,
  CircleDot,
  Zap,
  Candy,
  Blocks,
  Footprints,
  Dices,
  Gamepad2,
  Rocket,
  type LucideIcon
} from 'lucide-react';
import { GameCard } from './game-card';

export const ALL_GAMES = [
  // Board & Strategy Games
  {
    id: 'chess',
    title: 'Chess Masters',
    icon: Crown,
    category: 'Board & Strategy',
    players: 'ELO Matchmaking',
    prize: '$100 Pool',
    rules: 'Classic chess rules with ELO-based matchmaking. Win by checkmate or opponent resignation.',
  },
  {
    id: 'checkers',
    title: 'Checkers Pro',
    icon: Dice3,
    category: 'Board & Strategy',
    players: 'ELO Matchmaking',
    prize: '$75 Pool',
    rules: 'Traditional checkers rules. Capture all opponent pieces or block their moves to win.',
  },
  {
    id: 'ludo',
    title: 'Ludo Kings',
    icon: Boxes,
    category: 'Board & Strategy',
    players: '4 Players',
    prize: '$50 Pool',
    rules: 'Roll dice to move pieces. First player to get all pieces home wins.',
  },
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Pro',
    icon: Target,
    category: 'Board & Strategy',
    players: '2 Players',
    prize: '$25 Pool',
    rules: 'Get three in a row to win. Play continues until one player wins.',
  },
  {
    id: 'connect4',
    title: 'Connect Four',
    icon: Hexagon,
    category: 'Board & Strategy',
    players: '2 Players',
    prize: '$40 Pool',
    rules: 'Drop tokens to connect four in any direction. Best of three matches.',
  },
  {
    id: 'sudoku',
    title: 'Speed Sudoku',
    icon: Puzzle,
    category: 'Board & Strategy',
    players: 'Race Mode',
    prize: '$60 Pool',
    rules: 'Complete the Sudoku puzzle before your opponent. First to solve wins.',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    icon: Heart,
    category: 'Board & Strategy',
    players: '2 Players',
    prize: '$30 Pool',
    rules: 'Match pairs of cards. Player with most pairs wins. Time limit applies.',
  },
  {
    id: 'snakeladders',
    title: 'Snake & Ladders',
    icon: Sparkles,
    category: 'Board & Strategy',
    players: '4 Players',
    prize: '$45 Pool',
    rules: 'Roll dice to move. Climb ladders, avoid snakes. First to finish wins.',
  },
  {
    id: 'rps',
    title: 'Rock Paper Scissors',
    icon: Trophy,
    category: 'Board & Strategy',
    players: '2 Players',
    prize: '$20 Pool',
    rules: 'Best of 10 rounds. Classic rules apply. Most wins takes the pool.',
  },

  // Skill & Sports Games
  {
    id: 'pool',
    title: '8-Ball Pool',
    icon: CircleDot,
    category: 'Skill & Sports',
    players: 'Live Matches',
    prize: '$80 Pool',
    rules: 'Standard 8-ball rules. Pot your balls then black to win.',
  },
  {
    id: 'snake',
    title: 'Snake Run',
    icon: Zap,
    category: 'Skill & Sports',
    players: 'Survival Mode',
    prize: '$35 Pool',
    rules: 'Grow your snake by eating food. Longest survival time wins.',
  },
  {
    id: 'sugarcrash',
    title: 'Sugar Crash',
    icon: Candy,
    category: 'Skill & Sports',
    players: 'Score Attack',
    prize: '$55 Pool',
    rules: 'Match candies for points. Highest score in time limit wins.',
  },
  {
    id: 'tetris',
    title: 'Tetris Masters',
    icon: Blocks,
    category: 'Skill & Sports',
    players: 'Score Attack',
    prize: '$70 Pool',
    rules: 'Clear lines for points. Survival time adds bonus. Highest score wins.',
  },
  {
    id: 'temple',
    title: 'Temple Sprint',
    icon: Footprints,
    category: 'Skill & Sports',
    players: 'Distance Run',
    prize: '$65 Pool',
    rules: 'Run, jump, and slide. Longest distance covered wins.',
  },

  // Casino & Luck-Based Games
  {
    id: 'dice',
    title: 'Roll Dice',
    icon: Dices,
    category: 'Casino',
    players: 'Single Player',
    prize: 'Win 50x',
    rules: 'Roll to reach 50 points. Hold score or risk losing all.',
  },
  {
    id: 'slots',
    title: 'Lucky Slots',
    icon: Gamepad2,
    category: 'Casino',
    players: 'Single Player',
    prize: 'Win 100x',
    rules: 'Match symbols for wins. Special combinations for jackpots.',
  },
  {
    id: 'crash',
    title: 'Crash Rocket',
    icon: Rocket,
    category: 'Casino',
    players: 'Single Player',
    prize: 'Win 1000x',
    rules: 'Cash out before the rocket crashes. Higher risk, higher reward.',
  },
] as const;

export function GameGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ALL_GAMES.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
    </div>
  );
}