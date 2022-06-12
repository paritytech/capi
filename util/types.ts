export type ValueOf<T> = T[keyof T];

export type U2I<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
  : never;

// Sometimes, the checker isn't wise enough, and we must summon dark forces.
export type AsKeyof<K, T> = K extends keyof T ? K : never;

export type EnsureLookup<
  K extends PropertyKey,
  ValueConstraint,
  Lookup extends {
    [_ in K]: ValueConstraint;
  },
> = Lookup;

export type Flatten<T> = T extends Function ? T : { [K in keyof T]: T[K] };

export type Narrow<T> =
  | (T extends infer U ? U : never)
  | Extract<
    T,
    number | string | boolean | bigint | symbol | null | undefined | []
  >
  | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> });
