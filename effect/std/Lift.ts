import { Effect, Id } from "../Base.ts";

export class Lift<A> extends Effect<{}, never, A, []> {
  constructor(readonly value: A) {
    super([], async () => {
      return value;
    });
  }

  get cacheKey(): string {
    return `Lift(${Id(this.value).toString()})`;
  }
}

export const lift = <A>(value: A): Lift<A> => {
  return new Lift(value);
};
