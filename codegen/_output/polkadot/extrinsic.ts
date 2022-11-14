import { $, C, client } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as types from "./types/mod.ts"

const _extrinsic = {
  version: 4,
  extras: [_codec.$731, _codec.$733, _codec.$735],
  additional: [_codec.$4, _codec.$4, _codec.$11, _codec.$11],
  call: _codec.$181,
  address: _codec.$197,
  signature: _codec.$421,
}
export const extrinsic = C.extrinsic<typeof client, types.polkadot_runtime.RuntimeCall>(client)
