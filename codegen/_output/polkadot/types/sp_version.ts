import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $runtimeVersion: $.Codec<t.types.sp_version.RuntimeVersion> = _codec.$172

export interface RuntimeVersion {
  spec_name: string
  impl_name: string
  authoring_version: t.types.u32
  spec_version: t.types.u32
  impl_version: t.types.u32
  apis: Array<[Uint8Array, t.types.u32]>
  transaction_version: t.types.u32
  state_version: t.types.u8
}

export function RuntimeVersion(value: t.types.sp_version.RuntimeVersion) {
  return value
}
