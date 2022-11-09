import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $header: $.Codec<t.sp_runtime.generic.header.Header> = _codec.$187

export interface Header {
  parent_hash: t.primitive_types.H256
  number: t.Compact<t.u32>
  state_root: t.primitive_types.H256
  extrinsics_root: t.primitive_types.H256
  digest: t.sp_runtime.generic.digest.Digest
}

export function Header(value: t.sp_runtime.generic.header.Header) {
  return value
}
