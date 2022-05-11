import { A_, AnyEffect, E_, Effect } from "/effect/Base.ts";

export type TryCatchCb<Try, CatchResult> = (resolved: Try extends AnyEffect ? Try[E_] | Try[A_] : Try) => CatchResult;

export class TryCatch<
  Try = any,
  CatchResult = any,
> extends Effect<Try, Extract<CatchResult, Error>, Exclude<CatchResult, Error>> {
  constructor(
    readonly try_: Try,
    readonly catch_: TryCatchCb<Try, CatchResult>,
  ) {
    super();
  }
}

export const tryCatch = <
  Try,
  CatchResult,
>(
  try_: Try,
  catch_: TryCatchCb<Try, CatchResult>,
): TryCatch<Try, CatchResult> => {
  return new TryCatch(try_, catch_);
};
