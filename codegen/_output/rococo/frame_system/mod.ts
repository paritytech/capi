import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as extensions from "./extensions/mod.ts"
export * as limits from "./limits.ts"
export * as pallet from "./pallet.ts"

export const $accountInfo: $.Codec<t.frame_system.AccountInfo> = _codec.$3

export const $eventRecord: $.Codec<t.frame_system.EventRecord> = _codec.$18

export const $lastRuntimeUpgradeInfo: $.Codec<t.frame_system.LastRuntimeUpgradeInfo> = _codec.$159

export const $phase: $.Codec<t.frame_system.Phase> = _codec.$156

export interface AccountInfo {
  nonce: t.u32
  consumers: t.u32
  providers: t.u32
  sufficients: t.u32
  data: t.pallet_balances.AccountData
}

export function AccountInfo(value: t.frame_system.AccountInfo) {
  return value
}

export interface EventRecord {
  phase: t.frame_system.Phase
  event: t.polkadot_runtime.RuntimeEvent
  topics: Array<t.primitive_types.H256>
}

export function EventRecord(value: t.frame_system.EventRecord) {
  return value
}

export interface LastRuntimeUpgradeInfo {
  spec_version: t.Compact<t.u32>
  spec_name: string
}

export function LastRuntimeUpgradeInfo(value: t.frame_system.LastRuntimeUpgradeInfo) {
  return value
}

export type Phase =
  | t.frame_system.Phase.ApplyExtrinsic
  | t.frame_system.Phase.Finalization
  | t.frame_system.Phase.Initialization
export namespace Phase {
  export interface ApplyExtrinsic {
    type: "ApplyExtrinsic"
    value: t.u32
  }
  export interface Finalization {
    type: "Finalization"
  }
  export interface Initialization {
    type: "Initialization"
  }
  export function ApplyExtrinsic(
    value: t.frame_system.Phase.ApplyExtrinsic["value"],
  ): t.frame_system.Phase.ApplyExtrinsic {
    return { type: "ApplyExtrinsic", value }
  }
  export function Finalization(): t.frame_system.Phase.Finalization {
    return { type: "Finalization" }
  }
  export function Initialization(): t.frame_system.Phase.Initialization {
    return { type: "Initialization" }
  }
}
