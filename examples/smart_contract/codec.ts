import * as C from "http://localhost:5646/@local/mod.ts"

const $balanceCodec = C.$.u128
const $weightCodec = C.$.object(
  ["ref_time", C.$.compact(C.$.u64)],
  ["proof_size", C.$.compact(C.$.u64)],
)

export const $contractsApiCallArgs = C.$.tuple(
  // origin
  C.$.sizedUint8Array(32),
  // dest
  C.$.sizedUint8Array(32),
  // balance
  $balanceCodec,
  // weight
  C.$.option($weightCodec),
  // storage_deposit_limit
  C.$.option($balanceCodec),
  // data
  C.$.uint8Array,
)

export const $contractsApiCallReturn = C.$.object(
  // gas_consumed
  ["gas_consumed", $weightCodec],
  // gas_required
  ["gas_required", $weightCodec],
  // storage_deposit
  [
    "storage_deposit",
    C.$.taggedUnion("type", [
      ["Refund", ["value", $balanceCodec]],
      ["Charge", ["value", $balanceCodec]],
    ]),
  ],
  // debug_message
  ["debug_message", C.$.str],
  // result
  [
    "result",
    C.$.object(
      ["flags", C.$.u32],
      // TODO: improve result error coded
      ["data", C.$.result(C.$.uint8Array, C.$.never)],
    ),
  ],
)
