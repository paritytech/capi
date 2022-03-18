export class Ok<A> {
  constructor(readonly value: A) {}
}
export const ok = <A>(value: A): Ok<A> => {
  return new Ok(value);
};

export type Result<
  E extends Error,
  A,
> = E | Ok<A>;
export type AnyResult = Result<Error, any>;
