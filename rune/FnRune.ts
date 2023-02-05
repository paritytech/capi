import { Rune } from "./Rune.ts"
import { RunicArgs } from "./RunicArgs.ts"

export class FnRune<F extends (...args: any[]) => any, U> extends Rune<F, U> {
  call<A extends any[], T, X>(
    this: FnRune<(...args: A) => T, U>,
    ...args: RunicArgs<X, A>
  ) {
    return Rune.tuple([this.into(), ...args]).map(([fn, ...args]) => fn(...args))
  }
}
