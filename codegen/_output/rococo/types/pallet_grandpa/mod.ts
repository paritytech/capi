import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $storedPendingChange: $.Codec<t.types.pallet_grandpa.StoredPendingChange> = _codec.$517

export const $storedState: $.Codec<t.types.pallet_grandpa.StoredState> = _codec.$516

export interface StoredPendingChange {
  scheduled_at: t.types.u32
  delay: t.types.u32
  next_authorities: Array<[t.types.sp_finality_grandpa.app.Public, t.types.u64]>
  forced: t.types.u32 | undefined
}

export function StoredPendingChange(value: t.types.pallet_grandpa.StoredPendingChange) {
  return value
}

export type StoredState =
  | t.types.pallet_grandpa.StoredState.Live
  | t.types.pallet_grandpa.StoredState.PendingPause
  | t.types.pallet_grandpa.StoredState.Paused
  | t.types.pallet_grandpa.StoredState.PendingResume
export namespace StoredState {
  export interface Live {
    type: "Live"
  }
  export interface PendingPause {
    type: "PendingPause"
    scheduled_at: t.types.u32
    delay: t.types.u32
  }
  export interface Paused {
    type: "Paused"
  }
  export interface PendingResume {
    type: "PendingResume"
    scheduled_at: t.types.u32
    delay: t.types.u32
  }
  export function Live(): t.types.pallet_grandpa.StoredState.Live {
    return { type: "Live" }
  }
  export function PendingPause(
    value: Omit<t.types.pallet_grandpa.StoredState.PendingPause, "type">,
  ): t.types.pallet_grandpa.StoredState.PendingPause {
    return { type: "PendingPause", ...value }
  }
  export function Paused(): t.types.pallet_grandpa.StoredState.Paused {
    return { type: "Paused" }
  }
  export function PendingResume(
    value: Omit<t.types.pallet_grandpa.StoredState.PendingResume, "type">,
  ): t.types.pallet_grandpa.StoredState.PendingResume {
    return { type: "PendingResume", ...value }
  }
}
