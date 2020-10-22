import LRUMap from "mnemonist/lru-map";

const defaultCacheLimit = 10000;
const defaultResolver: ResolverFunction<any> = (...args) => args[0] as string;

type MemoizableFunction = (arg: any, ...args: any[]) => any;

export type ResolverFunction<T extends MemoizableFunction> = (
  ...args: Parameters<T>
) => string;

export type MemoizedFunction<T extends MemoizableFunction> = {
  (...args: Parameters<T>): ReturnType<T>;
  readonly cache: Map<string, ReturnType<T>>;
};

export interface MemoizeOptions<T extends MemoizableFunction> {
  readonly cacheLimit?: number;
  readonly resolver?: ResolverFunction<T>;
}

export function memoize<T extends MemoizableFunction>(
  func: T,
  {
    cacheLimit = defaultCacheLimit,
    resolver = defaultResolver
  }: MemoizeOptions<T> = {}
): MemoizedFunction<T> {
  const cache = new LRUMap<string, ReturnType<T>>(cacheLimit);

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