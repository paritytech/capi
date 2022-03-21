import * as u from "/_/util/mod.ts";
import * as z from "/system/Effect.ts";

export class Then<
  Target extends z.AnyEffect,
  Into,
> extends z.Effect<{}, u.Result<never, Into>, { target: Target }> {
  constructor(
    readonly target: Target,
    readonly useTargetResolved: (targetResolved: Target[z._A]) => Into,
  ) {
    super("Then", { target: target }, async (_, resolved) => {
      return u.ok(useTargetResolved(resolved.target));
    }, z.EffectFlags.None);
  }
}

export const then = <Target extends z.AnyEffect>(target: Target) => {
  return <Into>(
    useTargetResolved: (targetResolved: Target[z._A]) => Into,
  ): Then<Target, Into> => {
    return new Then(target, useTargetResolved);
  };
};
