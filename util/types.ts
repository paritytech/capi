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

export type AssertT<T, As> = T extends As ? T : never;
