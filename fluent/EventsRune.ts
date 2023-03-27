import { Chain } from "./ChainRune.ts"
import { HasSystemEvents } from "./constraints.ts"
import { PatternRune } from "./PatternRune.ts"

export class EventsRune<out C extends Chain, out U>
  extends PatternRune<Chain.Requirement<C, HasSystemEvents>, C, U>
{}
