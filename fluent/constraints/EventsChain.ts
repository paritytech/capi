import * as $ from "../../deps/scale.ts"
import { Chain } from "../ChainRune.ts"
import { StorageChain } from "./StorageChain.ts"

export type EventsChain<C extends Chain = Chain> = StorageChain<C, "System", "Events", {
  key: $.Codec<undefined>
  value: $.Codec<Event<any>>
}>
export namespace EventsChain {
  export type Event<C extends EventsChain> = Chain.Storage<C, "System", "Events">
}

interface Event<RuntimeEvent> {
  phase: EventPhase
  event: RuntimeEvent
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
