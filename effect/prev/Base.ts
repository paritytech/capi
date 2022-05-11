export const A_: unique symbol = Symbol();
export type A_ = typeof A_;

export const E_: unique symbol = Symbol();
export type E_ = typeof E_;

export const D_: unique symbol = Symbol();
export type D_ = typeof D_;

export abstract class Effect<
  D,
  E extends Error,
  A,
> {
  [D_]!: D extends AnyEffect ? D | D[D_] : never;
  [A_]!: A;
  [E_]!: E;
}

export type AnyEffect<A = any> = Effect<any, Error, A>;
export type MaybeEffect<A> = A | AnyEffect<A>;
export type MaybeEffectList<L extends unknown[]> = { [I in keyof L]: MaybeEffect<L[I]> };

export type Resolved<E> = E extends AnyEffect<infer A> ? A : E;
export type ResolvedCollection<D> = { [I in keyof D]: Resolved<D[I]> };
