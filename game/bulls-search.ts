export function bullsSearch(
  solutionSpace: Iterable<string>,
  query: string,
  bulls: number
): Set<string> {
  const distance = query.length - bulls;

  if (distance === 0) return new Set([query]);
  if (distance === query.length) return new Set(solutionSpace);

  const result = new Set<string>();

  for (const solution of solutionSpace) {
    const solutionDistance = bullsDistance(query, solution, distance);
    if (solutionDistance <= distance) result.add(solution);
  }

  return result;
}

export function bullsDistance(a: string, b: string, limit: number = a.length) {
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    distance++;
    if (distance > limit) return Infinity;
  }
  return distance;
}
