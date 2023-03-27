import * as $ from "../deps/scale.ts"
import { FrameMetadata } from "../frame_metadata/FrameMetadata.ts"
import { Chain } from "./ChainRune.ts"

export interface HasStorage<
  P extends string,
  N extends string,
  S extends Partial<FrameMetadata.StorageEntry>,
> extends Chain {
  metadata: Chain["metadata"] & {
    pallets: Record<P, {
      storage: Record<N, S>
    }>
  }
}
export namespace HasStorage {
  export interface Pick<
    A extends Chain,
    P extends Chain.PalletName<A>,
    K extends Chain.StorageName<A, P>,
  > extends HasStorage<P, K, Chain.Storage<A, P, K>> {}
}

export type HasSystemSs58Prefix = HasConstant<"System", "Ss58Prefix", { codec: $.Codec<number> }>

export interface HasConstant<
  P extends string,
  N extends string,
  C extends Partial<FrameMetadata.Constant>,
> extends Chain {
  metadata: Chain["metadata"] & {
    pallets: Record<P, {
      constants: Record<N, C>
    }>
  }
}
export namespace HasConstant {
  export interface Pick<
    A extends Chain,
    P extends Chain.PalletName<A>,
    K extends Chain.ConstantName<A, P>,
  > extends HasConstant<P, K, Chain.Constant<A, P, K>> {}
}

export type HasSystemEvents = HasStorage<"System", "Events", {
  key: $.Codec<undefined>
  value: $.Codec<Event<EventPhase, any>>
}>
export namespace HasSystemEvents {
  export type Get<C extends HasSystemEvents> = Chain.Storage<C, "System", "Events">
}

export interface Event<P extends EventPhase, E = any> {
  phase: P
  event: E
  topics: Uint8Array[]
}

export type EventPhase =
  | EventPhase.ApplyExtrinsicEvent
  | EventPhase.FinalizationEvent
  | EventPhase.InitializationEvent
export namespace EventPhase {
  export interface ApplyExtrinsicEvent {
    type: "ApplyExtrinsic"
    value: number
  }
  export function isApplyExtrinsicEvent(
    event: Event<EventPhase>,
  ): event is Event<ApplyExtrinsicEvent> {
    return event.phase.type === "ApplyExtrinsic"
  }
  export interface FinalizationEvent {
    type: "Finalization"
  }
  export interface InitializationEvent {
    type: "Initialization"
  }
}

export type HasSystemVersion = ConstantBearer<
  "System",
  "Version",
  { codec: $.Codec<RuntimeVersion> }
>

export interface RuntimeVersion {
  apis: [Uint8Array, number][]
  authoringVersion: number
  implName: string
  implVersion: number
  specName: string
  specVersion: number
  stateVersion: number
  transactionVersion: number
}
