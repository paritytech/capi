import { _A, AnyResolvable, CacheKey, Effect, Resolved } from "../Base.ts";

export type UseResolvedTarget<
  Target extends AnyResolvable,
  Into,
> = (resolvedTarget: Resolved<Target>) => Into;

export class Then<
  Target extends AnyResolvable,
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
    return `Then(${CacheKey(this.target)},${CacheKey(this.useResolvedTarget)})`;
  }
}

export const then = <Target extends AnyResolvable>(target: Target) => {
  return <Into>(useResolvedTarget: UseResolvedTarget<Target, Into>) => {
    return new Then(target, useResolvedTarget);
  };
};
