import { Effect, UnwrapAll, UnwrapE, UnwrapR } from "/effect/Effect.ts";
import { UnionToIntersection } from "/util/mod.ts";

export type Resolver<
  Args extends unknown[],
  R,
  Result,
> = (...args: UnwrapAll<Args>) => (env: R) => Promise<Result>;

export class Step<
  Args extends unknown[],
  R,
  Result,
> extends Effect<
  UnionToIntersection<UnwrapR<Args[number]>> & R,
  UnwrapE<Args[number]> | Extract<Result, Error>,
  Exclude<Result, Error>
> {
  constructor(
    readonly args: Args,
    readonly resolve: Resolver<Args, R, Result>,
  ) {
    super();
  }
}

export type AnyStep<A = any> = Step<any[], any, Error | A>;

export function step<
  Args extends unknown[],
  R,
  Result,
>(
  args: [...Args],
  resolve: Resolver<Args, R, Result>,
): Step<Args, R, Result> {
  return new Step(args, resolve);
}
