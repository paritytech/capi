import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $header: $.Codec<types.sp_runtime.generic.header.Header> = codecs.$187
export interface Header {
  parentHash: types.primitive_types.H256
  number: types.Compact<types.u32>
  stateRoot: types.primitive_types.H256
  extrinsicsRoot: types.primitive_types.H256
  digest: types.sp_runtime.generic.digest.Digest
}

export function Header(value: types.sp_runtime.generic.header.Header) {
  return value
}
