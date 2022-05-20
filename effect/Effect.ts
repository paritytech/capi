/** Key of environment requirement phantom in `Effect` */
export const R_: unique symbol = Symbol();
export type R_ = typeof R_;

/** Key of error result phantom in `Effect` */
export const E_: unique symbol = Symbol();
export type E_ = typeof E_;

/** Key of ok result phantom in `Effect` */
export const A_: unique symbol = Symbol();
export type A_ = typeof A_;

export class EffectState {
  id = 0;
  remainingVisits = new Map<string, number>();
  cache = new Map<unknown, number>();

  nextId = () => {
    return this.id++;
  };

  idOf = (inQuestion: unknown): number => {
    const prev = this.cache.get(inQuestion);
    if (prev) {
      return prev;
    }
    const id = this.nextId();
    this.cache.set(inQuestion, id);
    return id;
  };
}

export abstract class Effect<
  R,
  E extends Error,
  A,
> {
  static state = new EffectState();

  abstract signature: string;

  declare [R_]: R;
  declare [E_]: E;
  declare [A_]: A;
}

export type AnyEffect = Effect<any, Error, any>;

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

export const unwrapHOEffect = (e: AnyEffectLike): AnyEffect => {
  if (e instanceof HOEffect) {
    return unwrapHOEffect(e.root);
  }
  return e;
};
