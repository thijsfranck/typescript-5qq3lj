import { difference, intersection } from "mnemonist/set";
import VPTree from "mnemonist/vp-tree";
import { buildBullsSearchTree } from "./build-bulls-search-tree";
import { buildCowsSearchTree } from "./build-cows-search-tree";
import { bullsSearch } from "./bulls-search";
import { calculateSolutionSpace } from "./calculate-solution-space";
import { cowsSearch } from "./cows-search";
import { makeEducatedGuess } from "./make-educated-guess";
import { makeRandomGuess } from "./make-random-guess";
import { calculateSymbolSpace } from " ./symbols";
import { Turn } from "./types";
import { calculateBullsAndCows } from "./calculate-bulls-and-cows";

export class GameState {
  readonly turns: Turn[] = [];

  private _bullsSearchTree: VPTree<string>;
  private _cowsSearchTree: VPTree<string>;
  private _solutionSpace: Set<string>;
  private _symbolSpace: Set<string>;

  constructor(
    readonly symbolSpaceLength: number,
    readonly solutionLength: number
  ) {
    this._symbolSpace = calculateSymbolSpace(this.symbolSpaceLength);
    this._solutionSpace = calculateSolutionSpace(
      this.symbolSpace,
      this.solutionLength
    );
    this._bullsSearchTree = buildBullsSearchTree(this.solutionSpace);
    this._cowsSearchTree = buildCowsSearchTree(
      this.symbolSpace,
      this.solutionLength
    );
  }

  trySolve(solution: string) {
    const [alternatives, guess] = this.makeGuess();

    const [bulls, cows] = calculateBullsAndCows(solution, guess);

    const oldSolutionSpaceSize = this.solutionSpace.size;
    const oldSymbolSpaceSize = this.symbolSpace.size;

    this.limitSolutionSpace(guess, bulls, cows);

    const turn = {
      guess,
      bulls,
      cows,
      alternatives: alternatives.length,
      oldSolutionSpace: oldSolutionSpaceSize,
      newSolutionSpace: this.solutionSpace.size,
      oldSymbolSpace: oldSymbolSpaceSize,
      newSymbolSpace: this.symbolSpace.size
    };

    this.turns.push(turn);

    return bulls === this.solutionLength;
  }

  private makeGuess() {
    const alternatives = makeEducatedGuess(this.turns, this.solutionSpace),
      guess = makeRandomGuess(alternatives);
    return [alternatives, guess] as const;
  }

  private limitSolutionSpace(guess: string, bulls: number, cows: number) {
    if (cows === 0) {
      this._symbolSpace = difference(this.symbolSpace, new Set(guess));
      this._solutionSpace = intersection(
        this._solutionSpace,
        calculateSolutionSpace(this.symbolSpace, this.solutionLength)
      );
    } else if (bulls < this.solutionLength) {
      const byBulls = bullsSearch(this._bullsSearchTree, guess, bulls);
      const byCows = cowsSearch(this._cowsSearchTree, guess, cows);
      this._solutionSpace = intersection(this.solutionSpace, byBulls, byCows);
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
