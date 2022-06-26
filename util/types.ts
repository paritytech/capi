export type ValueOf<T> = T[keyof T];

export type U2I<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
  : never;

export type EnsureLookup<
  K extends PropertyKey,
  ValueConstraint,
  Lookup extends {
    [_ in K]: ValueConstraint;
  },
> = Lookup;

export type Flatten<T> = T extends (infer E)[] ? Flatten<E>[]
  : T extends object ? { [K in keyof T]: Flatten<T[K]> }
  : T;

export type Narrow<T> =
  | (T extends infer U ? U : never)
  | Extract<
    T,
    number | string | boolean | bigint | symbol | null | undefined | []
  >
  | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> });

export type AnyFn = (...args: any[]) => any;
export type AnyMethods = Record<string, (...args: any[]) => any>;
