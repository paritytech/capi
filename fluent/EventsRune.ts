import { Rune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"

export class EventsRune<
  out U,
  out C extends Chain = Chain,
  out E extends Chain.Event<C> = Chain.Event<C>,
> extends Rune<E[], U> {
  constructor(_prime: EventsRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
    super(_prime)
  }
}
