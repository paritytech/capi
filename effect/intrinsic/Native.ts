import { _E, _R, Effect, ExtractEffect, ResolvedCollection } from "/effect/Base.ts";
import * as U from "/util/mod.ts";

export type Run<
  Args extends unknown[],
  R,
  Result,
> = (...argsResolved: ResolvedCollection<Args>) => (env: R) => Promise<Result>;

export type Clean<
  Args extends unknown[],
  R,
  Result,
> = (...argsResolved: ResolvedCollection<Args>) => (env: R) => (result: Result) => Promise<void>;

export class Native<
  Args extends unknown[],
  R,
  Result,
> extends Effect<
  R & U.UnionToIntersection<ExtractEffect<Args[number]>[_R]>,
  Extract<Result, Error> | Extract<ExtractEffect<Args[number]>[_E], Error>,
  Exclude<Result, Error>
> {
  constructor(
    readonly args: Args,
    readonly run: Run<Args, R, Result>,
    readonly clean?: Clean<Args, R, Result>,
  ) {
    super();
  }
}

export const native = <
  Args extends unknown[],
  R,
  Result,
>(
  args: Args,
  run: Run<Args, R, Result>,
  clean?: Clean<Args, R, Result>,
): Native<Args, R, Result> => {
  return new Native(args, run, clean);
};
