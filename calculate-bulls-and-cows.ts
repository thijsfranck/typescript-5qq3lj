
export function calculateBullsAndCows(solution: string, guess: string) {
  bulls = guess.length - bullsDistance(solution, guess);
  cows = guess.length - cowsDistance(new Set(guess), new Set(solution));
}
