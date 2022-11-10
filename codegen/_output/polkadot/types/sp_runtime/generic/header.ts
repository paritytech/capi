import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $header: $.Codec<t.types.sp_runtime.generic.header.Header> = _codec.$187

export interface Header {
  parent_hash: t.types.primitive_types.H256
  number: t.Compact<t.types.u32>
  state_root: t.types.primitive_types.H256
  extrinsics_root: t.types.primitive_types.H256
  digest: t.types.sp_runtime.generic.digest.Digest
}

export function Header(value: t.types.sp_runtime.generic.header.Header) {
  return value
}
