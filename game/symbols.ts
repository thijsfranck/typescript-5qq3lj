export const symbols = "0123456789";

export const ILLEGAL_STARTING_CHARACTER = "0";

export function calculateSymbolSpace(symbolSpaceLength: number): Set<string> {
  return new Set(symbols.slice(0, symbolSpaceLength))
}