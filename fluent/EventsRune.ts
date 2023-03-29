import { Codec } from "../deps/scale.ts"
import { FrameMetadata } from "../frame_metadata/FrameMetadata.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class EventsRune<out C extends Chain, out U> extends PatternRune<Event<C>[], C, U> {}

export interface TmpEventsChain extends Chain {
  metadata: FrameMetadata & {
    pallets: {
      System: {
        storage: {
          Events: {
            key: Codec<void>
            value: Codec<_Event<any>[]>
          }
        }
      }
    }
  }
}

interface _EventsChain<RE> extends Chain {
  metadata: FrameMetadata & {
    pallets: {
      System: {
        storage: {
          Events: {
            key: Codec<void>
            value: Codec<_Event<RE>[]>
          }
        }
      }
    }
  }
}

export type RuntimeEvent<C extends Chain> = C extends _EventsChain<infer E> ? E : never
export type EventsChain<C extends Chain> = _EventsChain<RuntimeEvent<C>>

export type Event<C extends Chain> = _Event<RuntimeEvent<C>>

interface _Event<RE> {
  phase: EventPhase
  event: RE
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
