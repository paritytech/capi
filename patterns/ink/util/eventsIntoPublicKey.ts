import { Events } from "../../../fluent/mod.ts"
import { RunicArgs } from "../../../rune/mod.ts"
import { findResultEvent } from "./ResultEvent.ts"
import { resultEventIntoPublicKey } from "./resultEventIntoPublicKey.ts"

export function eventsIntoPublicKey<X>(...[events]: RunicArgs<X, [Events]>) {
  return resultEventIntoPublicKey(findResultEvent(events))
}
