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
  T extends E | A = E | A,
> {
  [_R]!: R & UnionToIntersection<Extract<D[number], AnyEffect>[_R]>;
  [_E]!: E | Extract<D[number], AnyEffect>[_E];
  [_A]!: A;

  constructor(
    readonly deps: D,
    readonly run: (
      runtime: R,
      ...resolved: Resolved<D>
    ) => T,
  ) {}
}

export type AnyEffect = Effect<any, any, any, any, any>;
export type AnyEffectA<A> = Effect<any, any, A, any, any>;

export type Resolved<D extends AnyEffect[]> = {
  [K in keyof D]: Resolved._0<D[K]>;
};
namespace Resolved {
  export type _0<T> = T extends AnyEffectA<infer A> ? A : T;
}
