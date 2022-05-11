import { AnyEffect, E_, Effect, Resolved } from "/effect/Base.ts";

export type FlatMapCb<
  Target extends AnyEffect,
  Result extends AnyEffect,
> = (resolved: Resolved<Target>) => Result;

export class FlatMap<
  Target extends AnyEffect = AnyEffect,
  Result extends AnyEffect = AnyEffect,
> extends Effect<Target, Extract<Target | Result, AnyEffect>[E_], Resolved<Result>> {
  constructor(
    readonly target: Target,
    readonly cb: FlatMapCb<Target, Result>,
  ) {
    super();
  }
}

export const flatMap = <
  Target extends AnyEffect,
  Result extends AnyEffect,
>(
  target: Target,
  cb: FlatMapCb<Target, Result>,
): FlatMap<Target, Result> => {
  return new FlatMap(target, cb);
};
