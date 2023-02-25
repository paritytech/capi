// TODO: delete this file and use codegen directly

import { $ } from "../../mod.ts"

export const $primaryPreDigest: $.Codec<PrimaryPreDigest> = $.object(
  $.field("authorityIndex", $.u32),
  $.field("slot", $.u64),
  $.field("vrfOutput", $.sizedUint8Array(32)),
  $.field("vrfProof", $.sizedUint8Array(64)),
)
export interface PrimaryPreDigest {
  authorityIndex: number
  slot: bigint
  vrfOutput: Uint8Array
  vrfProof: Uint8Array
}

export const $secondaryPlainPreDigest: $.Codec<SecondaryPlainPreDigest> = $.object(
  $.field("authorityIndex", $.u32),
  $.field("slot", $.u64),
)
export interface SecondaryPlainPreDigest {
  authorityIndex: number
  slot: bigint
}

export const $secondaryVRFPreDigest: $.Codec<SecondaryVRFPreDigest> = $.object(
  $.field("authorityIndex", $.u32),
  $.field("slot", $.u64),
  $.field("vrfOutput", $.sizedUint8Array(32)),
  $.field("vrfProof", $.sizedUint8Array(64)),
)
export interface SecondaryVRFPreDigest {
  authorityIndex: number
  slot: bigint
  vrfOutput: Uint8Array
  vrfProof: Uint8Array
}

export const $preDigest: $.Codec<PreDigest> = $.taggedUnion("type", {
  1: $.variant("Primary", $.field("value", $primaryPreDigest)),
  2: $.variant("SecondaryPlain", $.field("value", $secondaryPlainPreDigest)),
  3: $.variant("SecondaryVRF", $.field("value", $secondaryVRFPreDigest)),
})
export type PreDigest = PreDigest.Primary | PreDigest.SecondaryPlain | PreDigest.SecondaryVRF
export namespace PreDigest {
  export interface Primary {
    type: "Primary"
    value: PrimaryPreDigest
  }
  export interface SecondaryPlain {
    type: "SecondaryPlain"
    value: SecondaryPlainPreDigest
  }
  export interface SecondaryVRF {
    type: "SecondaryVRF"
    value: SecondaryVRFPreDigest
  }
}

export const $digestItem: $.Codec<DigestItem> = $.taggedUnion("type", {
  6: $.variant("PreRuntime", $.field("value", $.tuple($.sizedUint8Array(4), $.uint8Array))),
  4: $.variant("Consensus", $.field("value", $.tuple($.sizedUint8Array(4), $.uint8Array))),
  5: $.variant("Seal", $.field("value", $.tuple($.sizedUint8Array(4), $.uint8Array))),
  0: $.variant("Other", $.field("value", $.uint8Array)),
  8: $.variant("RuntimeEnvironmentUpdated"),
})
export type DigestItem =
  | DigestItem.PreRuntime
  | DigestItem.Consensus
  | DigestItem.Seal
  | DigestItem.Other
  | DigestItem.RuntimeEnvironmentUpdated
export namespace DigestItem {
  export interface PreRuntime {
    type: "PreRuntime"
    value: [Uint8Array, Uint8Array]
  }
  export interface Consensus {
    type: "Consensus"
    value: [Uint8Array, Uint8Array]
  }
  export interface Seal {
    type: "Seal"
    value: [Uint8Array, Uint8Array]
  }
  export interface Other {
    type: "Other"
    value: Uint8Array
  }
  export interface RuntimeEnvironmentUpdated {
    type: "RuntimeEnvironmentUpdated"
  }
}
