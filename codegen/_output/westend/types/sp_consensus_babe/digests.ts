import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type NextConfigDescriptor = types.sp_consensus_babe.digests.NextConfigDescriptor.V1
export namespace NextConfigDescriptor {
  export interface V1 {
    type: "V1"
    c: [types.u64, types.u64]
    allowedSlots: types.sp_consensus_babe.AllowedSlots
  }
  export function V1(
    value: Omit<types.sp_consensus_babe.digests.NextConfigDescriptor.V1, "type">,
  ): types.sp_consensus_babe.digests.NextConfigDescriptor.V1 {
    return { type: "V1", ...value }
  }
}

export type PreDigest =
  | types.sp_consensus_babe.digests.PreDigest.Primary
  | types.sp_consensus_babe.digests.PreDigest.SecondaryPlain
  | types.sp_consensus_babe.digests.PreDigest.SecondaryVRF
export namespace PreDigest {
  export interface Primary {
    type: "Primary"
    value: types.sp_consensus_babe.digests.PrimaryPreDigest
  }
  export interface SecondaryPlain {
    type: "SecondaryPlain"
    value: types.sp_consensus_babe.digests.SecondaryPlainPreDigest
  }
  export interface SecondaryVRF {
    type: "SecondaryVRF"
    value: types.sp_consensus_babe.digests.SecondaryVRFPreDigest
  }
  export function Primary(
    value: types.sp_consensus_babe.digests.PreDigest.Primary["value"],
  ): types.sp_consensus_babe.digests.PreDigest.Primary {
    return { type: "Primary", value }
  }
  export function SecondaryPlain(
    value: types.sp_consensus_babe.digests.PreDigest.SecondaryPlain["value"],
  ): types.sp_consensus_babe.digests.PreDigest.SecondaryPlain {
    return { type: "SecondaryPlain", value }
  }
  export function SecondaryVRF(
    value: types.sp_consensus_babe.digests.PreDigest.SecondaryVRF["value"],
  ): types.sp_consensus_babe.digests.PreDigest.SecondaryVRF {
    return { type: "SecondaryVRF", value }
  }
}

export interface PrimaryPreDigest {
  authorityIndex: types.u32
  slot: types.sp_consensus_slots.Slot
  vrfOutput: Uint8Array
  vrfProof: Uint8Array
}

export function PrimaryPreDigest(value: types.sp_consensus_babe.digests.PrimaryPreDigest) {
  return value
}

export interface SecondaryPlainPreDigest {
  authorityIndex: types.u32
  slot: types.sp_consensus_slots.Slot
}

export function SecondaryPlainPreDigest(
  value: types.sp_consensus_babe.digests.SecondaryPlainPreDigest,
) {
  return value
}

export interface SecondaryVRFPreDigest {
  authorityIndex: types.u32
  slot: types.sp_consensus_slots.Slot
  vrfOutput: Uint8Array
  vrfProof: Uint8Array
}

export function SecondaryVRFPreDigest(
  value: types.sp_consensus_babe.digests.SecondaryVRFPreDigest,
) {
  return value
}
