declare const T_: unique symbol;
declare const E_: unique symbol;

export abstract class Effect<N extends string, T, E extends Error> {
  declare [T_]: T;
  declare [E_]: E;

  constructor(readonly fqn: N) {}
}

export type AnyEffect<T = any> = Effect<string, T, Error>;

export type T_<U> = U extends AnyEffect<infer T> ? T : U;
export type E_<U> = U extends Effect<string, any, infer E> ? E : never;

export type Val<T> = T | AnyEffect<T>;
export type ValCollection<C extends unknown[]> = {
  [I in keyof C]: I extends `${number}` ? Val<C[I]> : C[I];
};
export type Resolved<C extends unknown[]> = { [I in keyof C]: T_<C[I]> };
