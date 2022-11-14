import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export interface StoredPendingChange {
  scheduled_at: types.u32
  delay: types.u32
  next_authorities: Array<[types.sp_finality_grandpa.app.Public, types.u64]>
  forced: types.u32 | undefined
}

export function StoredPendingChange(value: types.pallet_grandpa.StoredPendingChange) {
  return value
}

export type StoredState =
  | types.pallet_grandpa.StoredState.Live
  | types.pallet_grandpa.StoredState.PendingPause
  | types.pallet_grandpa.StoredState.Paused
  | types.pallet_grandpa.StoredState.PendingResume
export namespace StoredState {
  export interface Live {
    type: "Live"
  }
  export interface PendingPause {
    type: "PendingPause"
    scheduled_at: types.u32
    delay: types.u32
  }
  export interface Paused {
    type: "Paused"
  }
  export interface PendingResume {
    type: "PendingResume"
    scheduled_at: types.u32
    delay: types.u32
  }
  export function Live(): types.pallet_grandpa.StoredState.Live {
    return { type: "Live" }
  }
  export function PendingPause(
    value: Omit<types.pallet_grandpa.StoredState.PendingPause, "type">,
  ): types.pallet_grandpa.StoredState.PendingPause {
    return { type: "PendingPause", ...value }
  }
  export function Paused(): types.pallet_grandpa.StoredState.Paused {
    return { type: "Paused" }
  }
  export function PendingResume(
    value: Omit<types.pallet_grandpa.StoredState.PendingResume, "type">,
  ): types.pallet_grandpa.StoredState.PendingResume {
    return { type: "PendingResume", ...value }
  }
}
