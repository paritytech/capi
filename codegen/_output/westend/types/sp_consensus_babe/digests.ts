import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $nextConfigDescriptor: $.Codec<
  t.types.sp_consensus_babe.digests.NextConfigDescriptor
> = _codec.$192

export const $preDigest: $.Codec<t.types.sp_consensus_babe.digests.PreDigest> = _codec.$462

export const $primaryPreDigest: $.Codec<t.types.sp_consensus_babe.digests.PrimaryPreDigest> =
  _codec.$463

export const $secondaryPlainPreDigest: $.Codec<
  t.types.sp_consensus_babe.digests.SecondaryPlainPreDigest
> = _codec.$464

export const $secondaryVRFPreDigest: $.Codec<
  t.types.sp_consensus_babe.digests.SecondaryVRFPreDigest
> = _codec.$465

export type NextConfigDescriptor = t.types.sp_consensus_babe.digests.NextConfigDescriptor.V1
export namespace NextConfigDescriptor {
  export interface V1 {
    type: "V1"
    c: [t.types.u64, t.types.u64]
    allowed_slots: t.types.sp_consensus_babe.AllowedSlots
  }
  export function V1(
    value: Omit<t.types.sp_consensus_babe.digests.NextConfigDescriptor.V1, "type">,
  ): t.types.sp_consensus_babe.digests.NextConfigDescriptor.V1 {
    return { type: "V1", ...value }
  }
}

export type PreDigest =
  | t.types.sp_consensus_babe.digests.PreDigest.Primary
  | t.types.sp_consensus_babe.digests.PreDigest.SecondaryPlain
  | t.types.sp_consensus_babe.digests.PreDigest.SecondaryVRF
export namespace PreDigest {
  export interface Primary {
    type: "Primary"
    value: t.types.sp_consensus_babe.digests.PrimaryPreDigest
  }
  export interface SecondaryPlain {
    type: "SecondaryPlain"
    value: t.types.sp_consensus_babe.digests.SecondaryPlainPreDigest
  }
  export interface SecondaryVRF {
    type: "SecondaryVRF"
    value: t.types.sp_consensus_babe.digests.SecondaryVRFPreDigest
  }
  export function Primary(
    value: t.types.sp_consensus_babe.digests.PreDigest.Primary["value"],
  ): t.types.sp_consensus_babe.digests.PreDigest.Primary {
    return { type: "Primary", value }
  }
  export function SecondaryPlain(
    value: t.types.sp_consensus_babe.digests.PreDigest.SecondaryPlain["value"],
  ): t.types.sp_consensus_babe.digests.PreDigest.SecondaryPlain {
    return { type: "SecondaryPlain", value }
  }
  export function SecondaryVRF(
    value: t.types.sp_consensus_babe.digests.PreDigest.SecondaryVRF["value"],
  ): t.types.sp_consensus_babe.digests.PreDigest.SecondaryVRF {
    return { type: "SecondaryVRF", value }
  }
}

export interface PrimaryPreDigest {
  authority_index: t.types.u32
  slot: t.types.sp_consensus_slots.Slot
  vrf_output: Uint8Array
  vrf_proof: Uint8Array
}

export function PrimaryPreDigest(value: t.types.sp_consensus_babe.digests.PrimaryPreDigest) {
  return value
}

export interface SecondaryPlainPreDigest {
  authority_index: t.types.u32
  slot: t.types.sp_consensus_slots.Slot
}

export function SecondaryPlainPreDigest(
  value: t.types.sp_consensus_babe.digests.SecondaryPlainPreDigest,
) {
  return value
}

export interface SecondaryVRFPreDigest {
  authority_index: t.types.u32
  slot: t.types.sp_consensus_slots.Slot
  vrf_output: Uint8Array
  vrf_proof: Uint8Array
}

export function SecondaryVRFPreDigest(
  value: t.types.sp_consensus_babe.digests.SecondaryVRFPreDigest,
) {
  return value
}
