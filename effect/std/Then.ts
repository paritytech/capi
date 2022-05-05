import { _A, AnyEffect, Effect, Id } from "../Base.ts";

type UseResolvedTarget<
  Target extends AnyEffect,
  Into,
> = (resolvedTarget: Target[_A]) => Into;

export class Then<
  Target extends AnyEffect,
  Into,
> extends Effect<{}, never, Into, [Target]> {
  constructor(
    readonly target: Target,
    readonly useResolvedTarget: UseResolvedTarget<Target, Into>,
  ) {
    super([target], async (_, resolvedTarget) => {
      return useResolvedTarget(resolvedTarget);
    });
  }

  get cacheKey(): string {
    return `Then(${this.target.cacheKey},${Id(this.useResolvedTarget)})`;
  }
}

export const then = <Target extends AnyEffect>(target: Target) => {
  return <Into>(useResolvedTarget: UseResolvedTarget<Target, Into>) => {
    return new Then(target, useResolvedTarget);
  };
};
