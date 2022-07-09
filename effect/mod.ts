declare const T_: unique symbol;

// TODO: swap out with actual `Effect`
export class Effect<T> {
  declare [T_]: T;
}

// TODO: swap out with actual `Val`
export type Val<T> = T | Effect<T>;
