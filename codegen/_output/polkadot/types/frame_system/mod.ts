import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as extensions from "./extensions/mod.ts"
export * as limits from "./limits.ts"
export * as pallet from "./pallet.ts"

export const $accountInfo: $.Codec<t.types.frame_system.AccountInfo> = _codec.$3

export const $eventRecord: $.Codec<t.types.frame_system.EventRecord> = _codec.$18

export const $lastRuntimeUpgradeInfo: $.Codec<t.types.frame_system.LastRuntimeUpgradeInfo> =
  _codec.$159

export const $phase: $.Codec<t.types.frame_system.Phase> = _codec.$156

export interface AccountInfo {
  nonce: t.types.u32
  consumers: t.types.u32
  providers: t.types.u32
  sufficients: t.types.u32
  data: t.types.pallet_balances.AccountData
}

export function AccountInfo(value: t.types.frame_system.AccountInfo) {
  return value
}

export interface EventRecord {
  phase: t.types.frame_system.Phase
  event: t.types.polkadot_runtime.RuntimeEvent
  topics: Array<t.types.primitive_types.H256>
}

export function EventRecord(value: t.types.frame_system.EventRecord) {
  return value
}

export interface LastRuntimeUpgradeInfo {
  spec_version: t.Compact<t.types.u32>
  spec_name: string
}

export function LastRuntimeUpgradeInfo(value: t.types.frame_system.LastRuntimeUpgradeInfo) {
  return value
}

export type Phase =
  | t.types.frame_system.Phase.ApplyExtrinsic
  | t.types.frame_system.Phase.Finalization
  | t.types.frame_system.Phase.Initialization
export namespace Phase {
  export interface ApplyExtrinsic {
    type: "ApplyExtrinsic"
    value: t.types.u32
  }
  export interface Finalization {
    type: "Finalization"
  }
  export interface Initialization {
    type: "Initialization"
  }
  export function ApplyExtrinsic(
    value: t.types.frame_system.Phase.ApplyExtrinsic["value"],
  ): t.types.frame_system.Phase.ApplyExtrinsic {
    return { type: "ApplyExtrinsic", value }
  }
  export function Finalization(): t.types.frame_system.Phase.Finalization {
    return { type: "Finalization" }
  }
  export function Initialization(): t.types.frame_system.Phase.Initialization {
    return { type: "Initialization" }
  }
}
