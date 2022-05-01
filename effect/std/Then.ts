import { _A, AnyEffect, Effect } from "../Base.ts";

type UseResolvedTarget<
  Target extends AnyEffect,
  Into,
> = (resolvedTarget: Target[_A]) => Into;

export class Then<
  Target extends AnyEffect,
  Into,
> extends Effect<{}, never, Into, [Target]> {
  constructor(
    target: Target,
    useResolvedTarget: UseResolvedTarget<Target, Into>,
  ) {
    super([target], async (_, resolvedTarget) => {
      return useResolvedTarget(resolvedTarget);
    });
  }
}

export const then = <
  Target extends AnyEffect,
>(target: Target) => {
  return <Into>(useResolvedTarget: UseResolvedTarget<Target, Into>) => {
    return new Then(target, useResolvedTarget);
  };
};
