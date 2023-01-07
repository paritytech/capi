import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $digest: $.Codec<types.sp_runtime.generic.digest.Digest> = codecs.$12
export interface Digest {
  logs: Array<types.sp_runtime.generic.digest.DigestItem>
}

export function Digest(value: types.sp_runtime.generic.digest.Digest) {
  return value
}

export const $digestItem: $.Codec<types.sp_runtime.generic.digest.DigestItem> = codecs.$14
export type DigestItem =
  | types.sp_runtime.generic.digest.DigestItem.PreRuntime
  | types.sp_runtime.generic.digest.DigestItem.Consensus
  | types.sp_runtime.generic.digest.DigestItem.Seal
  | types.sp_runtime.generic.digest.DigestItem.Other
  | types.sp_runtime.generic.digest.DigestItem.RuntimeEnvironmentUpdated
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
    ...value: types.sp_runtime.generic.digest.DigestItem.PreRuntime["value"]
  ): types.sp_runtime.generic.digest.DigestItem.PreRuntime {
    return { type: "PreRuntime", value }
  }
  export function Consensus(
    ...value: types.sp_runtime.generic.digest.DigestItem.Consensus["value"]
  ): types.sp_runtime.generic.digest.DigestItem.Consensus {
    return { type: "Consensus", value }
  }
  export function Seal(
    ...value: types.sp_runtime.generic.digest.DigestItem.Seal["value"]
  ): types.sp_runtime.generic.digest.DigestItem.Seal {
    return { type: "Seal", value }
  }
  export function Other(
    value: types.sp_runtime.generic.digest.DigestItem.Other["value"],
  ): types.sp_runtime.generic.digest.DigestItem.Other {
    return { type: "Other", value }
  }
  export function RuntimeEnvironmentUpdated(): types.sp_runtime.generic.digest.DigestItem.RuntimeEnvironmentUpdated {
    return { type: "RuntimeEnvironmentUpdated" }
  }
}
