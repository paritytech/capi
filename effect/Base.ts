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

  toString(): string {
    const name = this.constructor.name;
    if (this.deps.length > 0) {
      return `${name}(${this.deps.map((value) => value.toString()).join(",")})`;
    }
    return name;
  }
}

export type AnyEffect = Effect<any, any, any, any>;
export type AnyEffectA<A> = Effect<any, any, A, any>;

export type Resolved<D extends AnyEffect[]> = {
  [K in keyof D]: Resolved._0<D[K]>;
};
namespace Resolved {
  export type _0<T> = T extends AnyEffectA<infer A> ? A : T;
}

export type AsAnyEffectAList<D extends any[]> = any[] & { [I in keyof D]: AnyEffectA<D[I]> };
