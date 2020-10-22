import { bullsDistance } from "./bulls-search";
import { cowsDistance } from "./cows-search";

export function calculateBullsAndCows(solution: string, guess: string) {
  const bulls = guess.length - bullsDistance(guess, solution);
  const cows = guess.length - cowsDistance(guess, solution);
  return [bulls, cows] as const;
}
