import { AnyEffect, D_, E_, Effect, ResolvedCollection } from "/effect/Base.ts";
import * as U from "/util/mod.ts";

export const R_: unique symbol = Symbol();
export type R_ = typeof R_;

export type Resolve<
  D extends unknown[],
  R,
  Result,
> = (...allResolved: ResolvedCollection<D>) => (env: R) => Promise<Result>;

export type Cleanup<
  D extends unknown[],
  R,
  Result,
> = (...allResolved: ResolvedCollection<D>) => (env: R) => (result: Result) => Promise<void>;

export class Native<
  D extends unknown[] = any[],
  R = any,
  Result = any,
> extends Effect<
  D[number],
  Extract<Result, Error> | Extract<D[number], AnyEffect>[E_],
  Exclude<Result, Error>
> {
  [R_]: R;

  constructor(
    readonly deps: D,
    readonly resolve: Resolve<D, R, Result>,
    readonly cleanup?: Cleanup<D, R, Result>,
  ) {
    super();
  }
}

export type Env<E extends AnyEffect> = U.UnionToIntersection<(Extract<E | E[D_], Native>)[R_]>;

export const native = <
  D extends unknown[],
  R,
  Result,
>(
  deps: D,
  resolve: Resolve<D, R, Result>,
  cleanup?: Cleanup<D, R, Result>,
): Native<D, R, Result> => {
  return new Native(deps, resolve, cleanup);
};
