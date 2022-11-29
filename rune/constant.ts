import { _Future, Future, FutureCtx } from "./future.ts"
import { Id } from "./id.ts"

export const constant = <T>(value: T) =>
  new Future<T, never>(Id.hash(Id.loc``, value), (ctx) => new _ConstantFuture(ctx, value))

class _ConstantFuture<T> extends _Future<T> {
  constructor(ctx: FutureCtx, readonly value: T) {
    super(ctx)
  }

  start(): void {
    this.push(this.value)
    this.stop()
  }
}
