import { UnionToIntersection } from "/_/util/mod.ts";

export const _R: unique symbol = Symbol();
export type _R = typeof _R;

export const _E: unique symbol = Symbol();
export type _E = typeof _E;

export const _A: unique symbol = Symbol();
export type _A = typeof _A;

export abstract class Effect<
  R,
  E extends Error,
  A,
  D extends AnyResolvable[],
> {
  [_R]!: R & UnionToIntersection<Extract<D[number], AnyEffect>[_R]>;
  [_E]!: E | Extract<D[number], AnyEffect>[_E];
  [_A]!: A;

  constructor(
    readonly deps: D,
    readonly run: (
      runtime: R,
      ...resolved: DepsResolved<D>
    ) => Promise<E | A>,
  ) {}

  get cacheKey(): string {
    return `${this.constructor.name}(${
      this.deps.map((dep) => {
        return dep.cacheKey;
      }).join(",")
    })`;
  }
}

export const CacheKeyFactory = () => {
  let id = 0;
  const nonEffectCacheKeys = new Map<unknown, string>();
  return (value: unknown): string => {
    if (value instanceof Effect) {
      return value.cacheKey;
    }
    const existing = nonEffectCacheKeys.get(value);
    if (existing) {
      return existing;
    }
    const cacheKey = (id++).toString();
    nonEffectCacheKeys.set(value, cacheKey);
    return cacheKey;
  };
};
export const CacheKey = CacheKeyFactory();

export type AnyEffectA<A> = Effect<any, any, A, any>;
export type AnyEffect = AnyEffectA<any>;
export type AnyResolvableA<A> = A | AnyEffectA<A>;
export type AnyResolvable = AnyResolvableA<any>;
export type Resolved<T extends AnyResolvable> = T extends AnyEffectA<infer A> ? A : T;
export type DepsResolved<D extends any[]> = { [K in keyof D]: Resolved<D[K]> };
export type MaybeUnresolved<D extends unknown[]> = any[] & { [I in keyof D]: AnyResolvableA<D[I]> };
