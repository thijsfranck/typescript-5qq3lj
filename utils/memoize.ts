import LRUMap from "mnemonist/lru-map";

const defaultCacheLimit = 10000;
const defaultResolver: ResolverFunction<any> = (...[arg0]) => arg0;

export type ResolverFunction<T> = (...args: T[]) => string;

export type MemoizedFunction<T, R> = {
  (...args: T[]): R;
  readonly cache: Map<string, R>;
};

export interface MemoizeOptions<T> {
  readonly cacheLimit?: number;
  readonly resolver?: ResolverFunction<T>;
}

export function memoize<T, R>(
  func: (...args: T[]) => R,
  {
    cacheLimit = defaultCacheLimit,
    resolver = defaultResolver
  }: MemoizeOptions<T> = {}
): MemoizedFunction<T, R> {
  const cache = new LRUMap<string, R>(cacheLimit);

  function memoized(...args: T[]) {
    const key = resolver.apply(null, args);

    if (cache.has(key)) return cache.get(key);

    const result = func.apply(null, args);

    cache.set(key, result);

    return result;
  }

  const result = Object.defineProperty(memoized, "cache", {
    get: () => cache
  });

  return result;
}
