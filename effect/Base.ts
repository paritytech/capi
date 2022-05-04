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
  D extends AnyEffect[],
> {
  [_R]!: R & UnionToIntersection<D[number][_R]>;
  [_E]!: E | D[number][_E];
  [_A]!: A;

  constructor(
    readonly deps: D,
    readonly run: (
      runtime: R,
      ...resolved: Resolved<D>
    ) => Promise<E | A>,
  ) {}

  get structure(): string {
    return `${this.constructor.name}(${
      this.deps.map((dep) => {
        return dep.structure;
      }).join(",")
    })`;
  }
}

export const IdFactory = () => {
  let id = 0;
  const cache = new Map<unknown, number>();
  return (value: unknown): number => {
    const existing = cache.get(value);
    if (existing) {
      return existing;
    }
    cache.set(value, id++);
    return id;
  };
};

export const Id = IdFactory();

export const NonIdempotent: unique symbol = Symbol();
export type NonIdempotent = typeof NonIdempotent;

export type AnyEffect = Effect<any, any, any, Effect<any, any, any, any>[]>;
export type AnyEffectA<A> = Effect<any, any, A, any>;

export type Resolved<D extends AnyEffect[]> = {
  [K in keyof D]: Resolved._0<D[K]>;
};
namespace Resolved {
  export type _0<T> = T extends AnyEffectA<infer A> ? A : T;
}

export type AsAnyEffectAList<D extends any[]> = any[] & { [I in keyof D]: AnyEffectA<D[I]> };
