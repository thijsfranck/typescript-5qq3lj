export interface Turn {
  readonly guess: string;
  readonly cows: number;
  readonly bulls: number;
  readonly alternatives?: number;
  readonly oldSolutionSpace?: number;
  readonly newSolutionSpace?: number;
  readonly oldSymbolSpace?: number;
  readonly newSymbolSpace?: number;
}
