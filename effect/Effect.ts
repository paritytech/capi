/** Key of environment requirement phantom in `Effect` */
export const R_: unique symbol = Symbol();
export type R_ = typeof R_;

/** Key of error result phantom in `Effect` */
export const E_: unique symbol = Symbol();
export type E_ = typeof E_;

/** Key of ok result phantom in `Effect` */
export const A_: unique symbol = Symbol();
export type A_ = typeof A_;

export abstract class Effect<
  R,
  E extends Error,
  A,
> {
  [R_]: R;
  [E_]: E;
  [A_]: A;

  constructor() {
    // @ts-ignore: The operand of a 'delete' operator must be optional.
    delete this[R_];
    // @ts-ignore: The operand of a 'delete' operator must be optional.
    delete this[E_];
    // @ts-ignore: The operand of a 'delete' operator must be optional.
    delete this[A_];
  }
}

export abstract class HOEffect<Root extends AnyEffectLike = AnyEffectLike> {
  abstract root: Root;
}

export type EffectLike<
  R,
  E extends Error,
  A,
> = Effect<R, E, A> | HOEffect<EffectLike<R, E, A>>;

export type AnyEffectLike<A = any> = EffectLike<any, Error, A>;

export type MaybeEffectLike<A> = A | AnyEffectLike<A>;

export type UnwrapR<T> = T extends EffectLike<infer R, Error, any> ? unknown extends R ? {} : R : {};
export type UnwrapE<T> = T extends EffectLike<any, infer E, any> ? E : never;
export type UnwrapA<T> = T extends AnyEffectLike<infer A> ? A : T;

export type WrapAll<T> = { [K in keyof T]: MaybeEffectLike<T[K]> };
export type UnwrapAll<T> = { [K in keyof T]: UnwrapA<T[K]> };
