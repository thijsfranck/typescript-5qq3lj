import { difference, intersection } from "mnemonist/set";
import { bullsSearch } from "./bulls-search";
import { calculateBullsAndCows } from "./calculate-bulls-and-cows";
import { calculateSolutionSpace } from "./calculate-solution-space";
import { cowsSearch } from "./cows-search";
import { makeEducatedGuess } from "./make-educated-guess";
import { makeRandomGuess } from "./make-random-guess";
import { calculateSymbolSpace } from " ./symbols";
import { Turn } from "./types";

export class GameState {
  readonly turns: Turn[] = [];

  private _solutionSpace: Set<string>;
  private _symbolSpace: Set<string>;

  constructor(
    readonly symbolSpaceLength: number,
    readonly solutionLength: number
  ) {
    this.init();
  }

  trySolve(solution: string) {
    console.time(`Turn ${this.turns.length + 1}`);

    const [alternatives, guess] = this.makeGuess();

    const [bulls, cows] = calculateBullsAndCows(solution, guess);

    const oldSolutionSpaceSize = this.solutionSpace.size;
    const oldSymbolSpaceSize = this.symbolSpace.size;

    this.limitSolutionSpace(guess, alternatives, bulls, cows);

    const turn: Turn = {
      guess,
      bulls,
      cows,
      alternatives: alternatives.size,
      oldSolutionSpace: oldSolutionSpaceSize,
      newSolutionSpace: this.solutionSpace.size,
      oldSymbolSpace: oldSymbolSpaceSize,
      newSymbolSpace: this.symbolSpace.size
    };

    this.turns.push(turn);

    console.timeEnd(`Turn ${this.turns.length}`);

    return bulls === this.solutionLength;
  }

  private init() {
    this._symbolSpace = calculateSymbolSpace(this.symbolSpaceLength);
    this._solutionSpace = calculateSolutionSpace(
      this.symbolSpace,
      this.solutionLength
    );
  }

  private makeGuess() {
    const alternatives = makeEducatedGuess(this.turns, this.solutionSpace),
      guess = makeRandomGuess(alternatives);
    return [new Set(alternatives), guess] as const;
  }

  private limitSolutionSpace(
    guess: string,
    alternatives: Set<string>,
    bulls: number,
    cows: number
  ) {
    if (bulls === this.solutionLength) return;

    if (cows === 0) {
      this._symbolSpace = difference(this.symbolSpace, new Set(guess));
      this._solutionSpace = intersection(
        alternatives,
        calculateSolutionSpace(this.symbolSpace, this.solutionLength)
      );
    } else {
      const byBulls = bullsSearch(alternatives, guess, bulls);
      const byCows = cowsSearch(alternatives, guess, cows);
      this._solutionSpace = intersection(byBulls, byCows);
    }

    this._solutionSpace.delete(guess);
  }

  get solutionSpace() {
    return this._solutionSpace;
  }

  get symbolSpace() {
    return this._symbolSpace;
  }
}
