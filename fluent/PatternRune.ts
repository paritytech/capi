import { Rune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"

export class PatternRune<out T, out C extends Chain, out U, out P = void> extends Rune<T, U> {
  constructor(
    _prime: PatternRune<T, C, U>["_prime"],
    readonly chain: ChainRune<C, U>,
    readonly parent: P,
  ) {
    super(_prime)
  }
}
