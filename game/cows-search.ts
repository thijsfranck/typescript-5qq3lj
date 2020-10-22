import { memoize } from "../utils";

export function cowsSearch(
  solutionSpace: Iterable<string>,
  query: string,
  cows: number
): Set<string> {
  const distance = query.length - cows;

  if (distance === query.length) return new Set(solutionSpace);

  const result = new Set<string>();

  for (const solution of solutionSpace) {
    const solutionDistance = cowsDistance(solution, query, distance);
    if (solutionDistance <= distance) result.add(solution);
  }

  return result;
}

export function cowsDistance(a: string, b: string, limit = a.length) {
  const charSet = toCharSet(b);
  let distance = 0;
  for (const char of a) {
    if (charSet.has(char)) continue;
    distance++;
    if (distance > limit) return Infinity;
  }
  return distance;
}

const toCharSet = memoize((a: string) => new Set(a));
