// TODO: delete this file and use codegen directly

import { $ } from "../../mod.ts"

const $balanceCodec = $.u128

export interface Weight {
  refTime: bigint
  proofSize: bigint
}
const $weightCodec: $.Codec<Weight> = $.object(
  $.field("refTime", $.compact($.u64)),
  $.field("proofSize", $.compact($.u64)),
)

export type ContractsApiCallArgs = [
  origin: Uint8Array,
  dest: Uint8Array,
  balance: bigint,
  weight: Weight | undefined,
  storageDepositLimit: bigint | undefined,
  data: Uint8Array,
]
export const $contractsApiCallArgs: $.Codec<ContractsApiCallArgs> = $.tuple(
  // origin
  $.sizedUint8Array(32),
  // dest
  $.sizedUint8Array(32),
  // balance
  $balanceCodec,
  // weight
  $.option($weightCodec),
  // storage_deposit_limit
  $.option($balanceCodec),
  // data
  $.uint8Array,
)

// TODO: clean this up
export interface ContractsApiCallResult {
  gasConsumed: Weight
  gasRequired: Weight
  storageDeposit: {
    type: "Refund"
    value: bigint
  } | {
    type: "Charge"
    value: bigint
  }
  debugMessage: string
  result: {
    flags: number
    data: Uint8Array
  }
}
export const $contractsApiCallResult: $.Codec<ContractsApiCallResult> = $.object(
  $.field("gasConsumed", $weightCodec),
  $.field("gasRequired", $weightCodec),
  $.field(
    "storageDeposit",
    $.taggedUnion("type", [
      $.variant("Refund", $.field("value", $balanceCodec)),
      $.variant("Charge", $.field("value", $balanceCodec)),
    ]),
  ),
  $.field("debugMessage", $.str),
  $.field(
    "result",
    $.object(
      $.field("flags", $.u32),
      // TODO: improve result error coded
      $.field("data", $.result($.uint8Array, $.never)),
    ),
  ),
)

export type ContractsApiInstantiateArgs = [
  origin: Uint8Array,
  balance: bigint,
  gasLimit: Weight | undefined,
  storageDepositLimit: bigint | undefined,
  codeOrHash: {
    type: "Upload" | "Existing"
    value: Uint8Array
  },
  data: Uint8Array,
  salt: Uint8Array,
]
export const $contractsApiInstantiateArgs: $.Codec<ContractsApiInstantiateArgs> = $.tuple(
  $.sizedUint8Array(32),
  $balanceCodec,
  $.option($weightCodec),
  $.option($balanceCodec),
  $.taggedUnion("type", [
    // code
    $.variant("Upload", $.field("value", $.uint8Array)),
    // hash
    $.variant("Existing", $.field("value", $.sizedUint8Array(32))),
  ]),
  $.uint8Array,
  $.uint8Array,
)

export interface ContractsApiInstantiateResult {
  gasConsumed: Weight
  gasRequired: Weight
  storageDeposit: {
    type: "Refund"
    value: bigint
  } | {
    type: "Charge"
    value: bigint
  }
  debugMessage: string
  result: {
    result: {
      flags: number
      data: Uint8Array
    }
    accountId: Uint8Array
  }
}
export const $contractsApiInstantiateResult: $.Codec<ContractsApiInstantiateResult> = $.object(
  $.field("gasConsumed", $weightCodec),
  $.field("gasRequired", $weightCodec),
  $.field(
    "storageDeposit",
    $.taggedUnion("type", [
      $.variant("Refund", $.field("value", $balanceCodec)),
      $.variant("Charge", $.field("value", $balanceCodec)),
    ]),
  ),
  $.field("debugMessage", $.str),
  $.field(
    "result",
    $.object(
      $.field(
        "result",
        $.object(
          $.field("flags", $.u32),
          // TODO: improve result error coded
          $.field("data", $.result($.uint8Array, $.never)),
        ),
      ),
      $.field("accountId", $.sizedUint8Array(32)),
    ),
  ),
)
