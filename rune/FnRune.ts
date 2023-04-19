import { Rune, RunicArgs } from "./Rune.ts"

export class FnRune<F extends (...args: any[]) => any, U> extends Rune<F, U> {
  call<A extends any[], T, X>(
    this: FnRune<(...args: A) => T, U>,
    ...args: RunicArgs<X, A>
  ) {
    return Rune.tuple([this.as(Rune), ...args]).map(([fn, ...args]) => fn(...args))
  }
}

Rune.FnRune = FnRune
