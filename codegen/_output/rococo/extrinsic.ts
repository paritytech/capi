import { $, C, client } from "./capi.ts"
import * as codecs from "./codecs.ts"
import type * as types from "./types/mod.ts"

const _extrinsic = {
  version: 4,
  extras: [codecs.$731, codecs.$733, codecs.$735],
  additional: [codecs.$4, codecs.$4, codecs.$11, codecs.$11],
  call: codecs.$181,
  address: codecs.$197,
  signature: codecs.$421,
}
export const extrinsic = C.extrinsic<typeof client, types.polkadot_runtime.RuntimeCall>(client)
