export function makeRandomGuess(alternatives: Iterable<string>) {
  if (!Array.isArray(alternatives)) alternatives = Array.from(alternatives);
  const guess = Math.floor(Math.random() * alternatives.length);
  return alternatives[guess];
}
