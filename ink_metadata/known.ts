import * as $ from "../deps/scale.ts"

const $balanceCodec = $.u128

export interface Weight {
  refTime: bigint
  proofSize: bigint
}
const $weightCodec: $.Codec<Weight> = $.object(
  ["refTime", $.compact($.u64)],
  ["proofSize", $.compact($.u64)],
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
  // gas_consumed
  ["gasConsumed", $weightCodec],
  // gas_required
  ["gasRequired", $weightCodec],
  // storage_deposit
  [
    "storageDeposit",
    $.taggedUnion("type", [
      ["Refund", ["value", $balanceCodec]],
      ["Charge", ["value", $balanceCodec]],
    ]),
  ],
  // debug_message
  ["debugMessage", $.str],
  // result
  [
    "result",
    $.object(
      ["flags", $.u32],
      // TODO: improve result error coded
      ["data", $.result($.uint8Array, $.never)],
    ),
  ],
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
  // origin
  $.sizedUint8Array(32),
  // balance
  $balanceCodec,
  // gasLimit
  $.option($weightCodec),
  // storageDepositLimit
  $.option($balanceCodec),
  // codeOrHash
  $.taggedUnion("type", [
    // code
    ["Upload", ["value", $.uint8Array]],
    // hash
    ["Existing", ["value", $.sizedUint8Array(32)]],
  ]),
  // data
  $.uint8Array,
  // salt
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
  // gas_consumed
  ["gasConsumed", $weightCodec],
  // gas_required
  ["gasRequired", $weightCodec],
  // storage_deposit
  [
    "storageDeposit",
    $.taggedUnion("type", [
      ["Refund", ["value", $balanceCodec]],
      ["Charge", ["value", $balanceCodec]],
    ]),
  ],
  // debug_message
  ["debugMessage", $.str],
  // result
  [
    "result",
    $.object(
      [
        "result",
        $.object(
          ["flags", $.u32],
          // TODO: improve result error coded
          ["data", $.result($.uint8Array, $.never)],
        ),
      ],
      ["accountId", $.sizedUint8Array(32)],
    ),
  ],
)
