import * as Z from "/effect/Effect.ts";
import { UnionToIntersection } from "/util/mod.ts";

export type Resolver<
  Args extends unknown[],
  R,
  Result,
> = (...args: Z.UnwrapAll<Args>) => (env: R) => Promise<Result>;

export class Step<
  Args extends unknown[],
  R,
  Result,
> extends Z.Effect<
  UnionToIntersection<Z.UnwrapR<Args[number]>> & R,
  Z.UnwrapE<Args[number]> | Extract<Result, Error>,
  Exclude<Result, Error>
> {
  constructor(
    readonly name: string,
    readonly args: Args,
    readonly resolve: Resolver<Args, R, Result>,
  ) {
    super();
  }

  signature(): string {
    return `${this.name}_${this.constructor.name}(${this.args.map(Z.Effect.state.idOf)})`;
  }
}

export type AnyStep<A = any> = Step<any[], any, Error | A>;

export const step = <
  Args extends unknown[],
  R,
  Result,
>(
  name: string,
  args: [...Args],
  resolve: Resolver<Args, R, Result>,
): Step<Args, R, Result> => {
  return new Step(name, args, resolve);
};
