export function makeRandomGuess(solutionSpace: Iterable<string>) {
  if (!Array.isArray(solutionSpace)) solutionSpace = [...solutionSpace];
  const guess = Math.floor(Math.random() * solutionSpace.length);
  return solutionSpace[guess];
}
