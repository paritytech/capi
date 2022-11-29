import { Id } from "./id.ts"
import { Invocation, PrimedRune, Rune } from "./rune.ts"

export const constant = <T>(value: T) =>
  new Rune<T, never>(Id.hash(Id.loc``, value), (ctx) => new ConstantPrimedRune(ctx, value))

class ConstantPrimedRune<T> extends PrimedRune<T> {
  constructor(ctx: Invocation, readonly value: T) {
    super(ctx)
  }

  start(): void {
    this.push(this.value)
    this.stop()
  }
}
