import DefaultMap from "mnemonist/default-map";
import { enumerate } from "../utils";
import { Turn } from "./game-state";

export function makeEducatedGuess(
  turns: Iterable<Turn>,
  solutionSpace: Iterable<string>
): Array<string> {
  const [bullsWeight, cowsWeight] = weighSymbols(turns);
  return makeGuess(bullsWeight, cowsWeight, solutionSpace);
}

function weighSymbols(turns: Iterable<Turn>) {
  const bullsWeight = new DefaultMap<string, DefaultMap<number, number>>(
    () => new DefaultMap(() => 0)
  );
  const cowsWeight = new DefaultMap<string, number>(() => 0);

  for (const { bulls, cows, guess } of turns) {
    for (const [key, index] of enumerate(guess)) {
      const bullsWeightMap = bullsWeight.get(key);
      if (bulls > 0)
        bullsWeightMap.set(index, bullsWeightMap.get(index) + bulls);
      if (cows > 0) cowsWeight.set(key, cowsWeight.get(key) + cows);
    }
  }
  return [bullsWeight, cowsWeight] as const;
}

function makeGuess(
  bullsWeight: DefaultMap<string, DefaultMap<number, number>>,
  cowsWeight: DefaultMap<string, number>,
  solutionSpace: Iterable<string>
): Array<string> {
  if (bullsWeight.size + cowsWeight.size === 0)
    return Array.from(solutionSpace);

  let alternatives: Array<string> = [],
    maxScore = -Infinity;

  for (const solution of solutionSpace) {
    let solutionScore = 0;

    for (const [key, index] of enumerate(solution)) {
      solutionScore -= cowsWeight.get(key) + bullsWeight.get(key).get(index);
      if (solutionScore < maxScore) break;
    }

    if (solutionScore === maxScore) alternatives.push(solution);

    if (solutionScore > maxScore) {
      alternatives = [solution];
      maxScore = solutionScore;
    }
  }

  return alternatives;
}
