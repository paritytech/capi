import { Chain } from "./ChainRune.ts"
import { EventsChain } from "./constraints/mod.ts"
import { PatternRune } from "./PatternRune.ts"

export class EventsRune<out C extends Chain, out U>
  extends PatternRune<EventsChain.Event<C>[], C, U>
{}
