import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

/** A rune representing a list of events in system storage */
export class EventsRune<out C extends Chain, out U>
  extends PatternRune<Chain.Storage.Value<C, "System", "Events">, C, U>
{}

export interface Event<RE = any> {
  phase: EventPhase
  event: RE
  topics: Uint8Array[]
}

export type EventPhase =
  | ApplyExtrinsicEventPhase
  | FinalizationEventPhase
  | InitializationEventPhase

export interface ApplyExtrinsicEventPhase {
  type: "ApplyExtrinsic"
  value: number
}
export interface FinalizationEventPhase {
  type: "Finalization"
}
export interface InitializationEventPhase {
  type: "Initialization"
}
