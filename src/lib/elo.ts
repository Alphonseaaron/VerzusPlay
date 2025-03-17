// ELO Rating System Implementation
const K_FACTOR = 32; // Standard K-factor for rating adjustments

export function calculateEloChange(
  playerRating: number,
  opponentRating: number,
  result: 'win' | 'loss' | 'draw'
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  let actualScore: number;

  switch (result) {
    case 'win':
      actualScore = 1;
      break;
    case 'draw':
      actualScore = 0.5;
      break;
    case 'loss':
      actualScore = 0;
      break;
  }

  return Math.round(K_FACTOR * (actualScore - expectedScore));
}

export function getNewRating(currentRating: number, ratingChange: number): number {
  return Math.max(100, currentRating + ratingChange);
}