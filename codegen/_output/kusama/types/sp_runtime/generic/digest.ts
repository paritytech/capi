import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $digest: $.Codec<t.types.sp_runtime.generic.digest.Digest> = _codec.$13

export const $digestItem: $.Codec<t.types.sp_runtime.generic.digest.DigestItem> = _codec.$15

export interface Digest {
  logs: Array<t.types.sp_runtime.generic.digest.DigestItem>
}

export function Digest(value: t.types.sp_runtime.generic.digest.Digest) {
  return value
}

export type DigestItem =
  | t.types.sp_runtime.generic.digest.DigestItem.PreRuntime
  | t.types.sp_runtime.generic.digest.DigestItem.Consensus
  | t.types.sp_runtime.generic.digest.DigestItem.Seal
  | t.types.sp_runtime.generic.digest.DigestItem.Other
  | t.types.sp_runtime.generic.digest.DigestItem.RuntimeEnvironmentUpdated
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
  export function PreRuntime(
    ...value: t.types.sp_runtime.generic.digest.DigestItem.PreRuntime["value"]
  ): t.types.sp_runtime.generic.digest.DigestItem.PreRuntime {
    return { type: "PreRuntime", value }
  }
  export function Consensus(
    ...value: t.types.sp_runtime.generic.digest.DigestItem.Consensus["value"]
  ): t.types.sp_runtime.generic.digest.DigestItem.Consensus {
    return { type: "Consensus", value }
  }
  export function Seal(
    ...value: t.types.sp_runtime.generic.digest.DigestItem.Seal["value"]
  ): t.types.sp_runtime.generic.digest.DigestItem.Seal {
    return { type: "Seal", value }
  }
  export function Other(
    value: t.types.sp_runtime.generic.digest.DigestItem.Other["value"],
  ): t.types.sp_runtime.generic.digest.DigestItem.Other {
    return { type: "Other", value }
  }
  export function RuntimeEnvironmentUpdated(): t.types.sp_runtime.generic.digest.DigestItem.RuntimeEnvironmentUpdated {
    return { type: "RuntimeEnvironmentUpdated" }
  }
}
