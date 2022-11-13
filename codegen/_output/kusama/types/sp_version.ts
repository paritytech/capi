import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const $runtimeVersion: $.Codec<types.sp_version.RuntimeVersion> = _codec.$172

export interface RuntimeVersion {
  spec_name: string
  impl_name: string
  authoring_version: types.u32
  spec_version: types.u32
  impl_version: types.u32
  apis: Array<[Uint8Array, types.u32]>
  transaction_version: types.u32
  state_version: types.u8
}

export function RuntimeVersion(value: types.sp_version.RuntimeVersion) {
  return value
}
