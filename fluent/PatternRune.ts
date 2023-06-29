import { Rune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"

/** a convenience rune that lays out the structure of most other runes of the fluent API */
export class PatternRune<out T, out C extends Chain, out U, out P = void> extends Rune<T, U> {
  constructor(
    _prime: PatternRune<T, C, U>["_prime"],
    readonly chain: ChainRune<C, U>,
    readonly parent: P,
  ) {
    super(_prime)
  }
}
