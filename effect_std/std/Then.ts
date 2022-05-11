import { Effect, Resolved } from "../Base.ts";

export type Into<
  Target,
  Result,
> = (target: Resolved<Target>) => Result;

export class Then<
  Target,
  Result,
> extends Effect<[Target], Result, never, {}> {
  constructor(
    readonly target: Target,
    readonly into: Into<Target, Result>,
  ) {
    super([target], (target) => {
      return async () => {
        return into(target);
      };
    });
  }
}

export const then = <Target>(target: Target) => {
  return <Result>(into: Into<Target, Result>): Then<Target, Result> => {
    return new Then(target, into);
  };
};
