import { Codec } from "../deps/scale.ts"
import { FrameMetadata } from "../frame_metadata/FrameMetadata.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class EventsRune<out C extends Chain, out U> extends PatternRune<Event<C>[], C, U> {}

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
