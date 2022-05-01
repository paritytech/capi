import { Effect } from "../Base.ts";

export class Lift<A> extends Effect<{}, never, A, []> {
  constructor(value: A) {
    super([], async () => {
      return value;
    });
  }
}

export const lift = <A>(value: A): Lift<A> => {
  return new Lift(value);
};
