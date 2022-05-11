export const _R: unique symbol = Symbol();
export type _R = typeof _R;

export const _E: unique symbol = Symbol();
export type _E = typeof _E;

export const _A: unique symbol = Symbol();
export type _A = typeof _E;

export abstract class Effect<R, E extends Error, A> {
  [_R]!: R;
  [_E]!: E;
  [_A]!: A;
}

export type AnyEffect<A = any> = Effect<any, Error, A>;

export abstract class Container<A = any> {
  abstract inner: AnyEffect<A>;
}

export type AnyEffectLike<A = any> = AnyEffect<A> | Container<A>;
export type MaybeEffectLike<A> = A | AnyEffectLike<A>;
export type MaybeEffectLikeList<T extends unknown[]> = { [I in keyof T]: MaybeEffectLike<T[I]> };

export type Resolved<M> = M extends AnyEffectLike<infer A> ? A : M;
export type ResolvedCollection<C> = { [I in keyof C]: Resolved<C[I]> };

export type ExtractEffect<T> = Extract<T, AnyEffect> | Extract<T, Container>["inner"];
