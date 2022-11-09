import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $storedPendingChange: $.Codec<t.pallet_grandpa.StoredPendingChange> = _codec.$517

export const $storedState: $.Codec<t.pallet_grandpa.StoredState> = _codec.$516

export interface StoredPendingChange {
  scheduled_at: t.u32
  delay: t.u32
  next_authorities: Array<[t.sp_finality_grandpa.app.Public, t.u64]>
  forced: t.u32 | undefined
}

export function StoredPendingChange(value: t.pallet_grandpa.StoredPendingChange) {
  return value
}

export type StoredState =
  | t.pallet_grandpa.StoredState.Live
  | t.pallet_grandpa.StoredState.PendingPause
  | t.pallet_grandpa.StoredState.Paused
  | t.pallet_grandpa.StoredState.PendingResume
export namespace StoredState {
  export interface Live {
    type: "Live"
  }
  export interface PendingPause {
    type: "PendingPause"
    scheduled_at: t.u32
    delay: t.u32
  }
  export interface Paused {
    type: "Paused"
  }
  export interface PendingResume {
    type: "PendingResume"
    scheduled_at: t.u32
    delay: t.u32
  }
  export function Live(): t.pallet_grandpa.StoredState.Live {
    return { type: "Live" }
  }
  export function PendingPause(
    value: Omit<t.pallet_grandpa.StoredState.PendingPause, "type">,
  ): t.pallet_grandpa.StoredState.PendingPause {
    return { type: "PendingPause", ...value }
  }
  export function Paused(): t.pallet_grandpa.StoredState.Paused {
    return { type: "Paused" }
  }
  export function PendingResume(
    value: Omit<t.pallet_grandpa.StoredState.PendingResume, "type">,
  ): t.pallet_grandpa.StoredState.PendingResume {
    return { type: "PendingResume", ...value }
  }
}
