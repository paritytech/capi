import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class EventsRune<out C extends Chain, out U>
  extends PatternRune<Chain.Storage.Value<C, "System", "Events">, C, U>
{}

export interface Event<RE = any> {
  phase: EventPhase
  event: RE
  topics: string[]
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

// TODO: delete this
export interface SystemExtrinsicFailedEvent {
  phase: ApplyExtrinsicEventPhase
  event: {
    type: "System"
    value: {
      type: "ExtrinsicFailed"
      dispatchError: DispatchError
      dispatchInfo: any // TODO
    }
  }
}
export type DispatchError =
  | "Other"
  | "CannotLookup"
  | "BadOrigin"
  | "Module"
  | "ConsumerRemaining"
  | "NoProviders"
  | "TooManyConsumers"
  | "Token"
  | "Arithmetic"
  | "Transactional"
  | "Exhausted"
  | "Corruption"
  | "Unavailable"
  | { type: "Module"; value: number }

export function isSystemExtrinsicFailedEvent(e: _Event<any>): e is SystemExtrinsicFailedEvent {
  const { event } = e
  if (event.type === "System") {
    const { value } = event
    return typeof value === "object" && value !== null && "type" in value
      && value.type === "ExtrinsicFailed"
  }
  return false
}
