import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as extensions from "./extensions/mod.ts"
export * as limits from "./limits.ts"
export * as pallet from "./pallet.ts"

export const $accountInfo: $.Codec<types.frame_system.AccountInfo> = codecs.$3
export interface AccountInfo {
  nonce: types.u32
  consumers: types.u32
  providers: types.u32
  sufficients: types.u32
  data: types.pallet_balances.AccountData
}

export function AccountInfo(value: types.frame_system.AccountInfo) {
  return value
}

export const $eventRecord: $.Codec<types.frame_system.EventRecord> = codecs.$17
export interface EventRecord {
  phase: types.frame_system.Phase
  event: types.polkadot_runtime.Event
  topics: Array<types.primitive_types.H256>
}

export function EventRecord(value: types.frame_system.EventRecord) {
  return value
}

export const $lastRuntimeUpgradeInfo: $.Codec<types.frame_system.LastRuntimeUpgradeInfo> =
  codecs.$159
export interface LastRuntimeUpgradeInfo {
  specVersion: types.Compact<types.u32>
  specName: string
}

export function LastRuntimeUpgradeInfo(value: types.frame_system.LastRuntimeUpgradeInfo) {
  return value
}

export const $phase: $.Codec<types.frame_system.Phase> = codecs.$156
export type Phase =
  | types.frame_system.Phase.ApplyExtrinsic
  | types.frame_system.Phase.Finalization
  | types.frame_system.Phase.Initialization
export namespace Phase {
  export interface ApplyExtrinsic {
    type: "ApplyExtrinsic"
    value: types.u32
  }
  export interface Finalization {
    type: "Finalization"
  }
  export interface Initialization {
    type: "Initialization"
  }
  export function ApplyExtrinsic(
    value: types.frame_system.Phase.ApplyExtrinsic["value"],
  ): types.frame_system.Phase.ApplyExtrinsic {
    return { type: "ApplyExtrinsic", value }
  }
  export function Finalization(): types.frame_system.Phase.Finalization {
    return { type: "Finalization" }
  }
  export function Initialization(): types.frame_system.Phase.Initialization {
    return { type: "Initialization" }
  }
}
