import { memoize } from "../utils";

export function cowsSearch(
  solutionSpace: Iterable<string>,
  query: string,
  cows: number
): Set<string> {
  const distance = query.length - cows;

  if (distance === query.length) return new Set(solutionSpace);

  const sortedQuery = query
    .split("")
    .sort()
    .join("");

  const result = new Set<string>();

  for (const solution of solutionSpace) {
    const solutionDistance = cowsDistance(solution, sortedQuery);
    if (solutionDistance <= distance) result.add(solution);
  }

  return result;
}

export const cowsDistance = memoize(_cowsDistance, {
  resolver: (a, b) => a.concat(b)
});

function _cowsDistance(a: string, b: string) {
  const charSet = toCharSet(b);
  let distance = 0;
  for (const char of a) {
    if (!charSet.has(char)) distance++;
  }
  return distance;
}

const toCharSet = memoize((a: string) => new Set(a));
