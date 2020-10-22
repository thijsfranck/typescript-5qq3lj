import { difference } from "mnemonist/set";
import { memoize } from "../utils";

export function cowsSearch(
  solutionSpace: Iterable<string>,
  query: string,
  cows: number
): Set<string> {
  const distance = query.length - cows;

  if (distance === query.length) return new Set(solutionSpace);

  const sortedQuery = sortString(query);

  const result = new Set<string>();

  for (const solution of solutionSpace) {
    const solutionDistance = cowsDistance(sortString(solution), sortedQuery);
    if (solutionDistance <= distance) result.add(solution);
  }

  return result;
}

export const cowsDistance = memoize(_cowsDistance, {
  resolver: (a, b) => a.concat(b)
});

function _cowsDistance(a: string, b: string) {
  return difference(toCharSet(a), toCharSet(b)).size;
}

const sortString = memoize((a: string) =>
  a
    .split("")
    .sort()
    .join("")
);

const toCharSet = memoize((a: string) => new Set(a));
