import { UnionToIntersection } from "/_/util/mod.ts";

export const _R: unique symbol = Symbol();
export type _R = typeof _R;

export const _E: unique symbol = Symbol();
export type _E = typeof _E;

export const _A: unique symbol = Symbol();
export type _A = typeof _A;

export abstract class Effect<
  D extends unknown[],
  A,
  E extends Error,
  R,
> {
  [_A]!: A;
  [_E]!: E | Extract<D[number], AnyEffect>[_E];
  [_R]!: R & UnionToIntersection<Extract<D[number], AnyEffect>[_R]>;

  constructor(
    readonly deps: D,
    readonly resolve: Resolver<D, A, E, R>,
  ) {}
}
export type AnyEffect<A = any> = Effect<any[], A, Error, any>;
export type MaybeEffect<A> = A | AnyEffect<A>;
export type MaybeEffectList<L extends unknown[]> = any[] & { [I in keyof L]: MaybeEffect<L[I]> };
export type Resolved<E> = E extends AnyEffect<infer A> ? A : E;
export type AllResolved<D extends unknown[]> = { [I in keyof D]: Resolved<D[I]> };

export type Resolver<
  D extends unknown[],
  A,
  E extends Error,
  R,
> = (...allResolved: AllResolved<D>) => (runtime: R) => Promise<E | A>;
