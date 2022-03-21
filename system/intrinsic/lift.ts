import * as u from "/_/util/mod.ts";
import * as z from "/system/Effect.ts";

export class Lift<A> extends z.Effect<{}, u.Result<never, A>, {}> {
  constructor(value: A) {
    super("Lift", {}, async () => {
      return u.ok(value);
    }, z.EffectFlags.None);
  }
}

export const lift = <A>(a: A): Lift<A> => {
  return new Lift(a);
};
