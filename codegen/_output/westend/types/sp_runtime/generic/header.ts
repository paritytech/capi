import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $header: $.Codec<types.sp_runtime.generic.header.Header> = _codec.$187

export interface Header {
  parent_hash: types.primitive_types.H256
  number: types.Compact<types.u32>
  state_root: types.primitive_types.H256
  extrinsics_root: types.primitive_types.H256
  digest: types.sp_runtime.generic.digest.Digest
}

export function Header(value: types.sp_runtime.generic.header.Header) {
  return value
}
