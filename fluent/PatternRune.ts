import { Rune } from "../mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"

export class PatternRune<out T, out C extends Chain, out U> extends Rune<T, U> {
  constructor(_prime: PatternRune<T, C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
  }
}
