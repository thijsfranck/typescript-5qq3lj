import { bullsDistance } from "./build-bulls-search-tree";
import { cowsDistance } from "./build-cows-search-tree";

export function calculateBullsAndCows(solution: string, guess: string) {
  const bulls = guess.length - bullsDistance(solution, guess);
  const cows = guess.length - cowsDistance(new Set(guess), new Set(solution));
  return [bulls, cows] as const;
}
