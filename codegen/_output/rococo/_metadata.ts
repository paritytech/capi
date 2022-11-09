import { $, BitSequence, ChainError, Era } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const extrinsic = {
  version: 4,
  extras: [_codec.$731, _codec.$733, _codec.$735],
  additional: [_codec.$4, _codec.$4, _codec.$11, _codec.$11],
  call: _codec.$181,
  address: _codec.$197,
  signature: _codec.$421,
}

export const types = _codec._all
