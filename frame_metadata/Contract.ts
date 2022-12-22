import * as $ from "../deps/scale.ts"
import { unreachable } from "../deps/std/testing/asserts.ts"
import { Ty, TyDef, UnionTyDefMember } from "./scale_info.ts"

export interface ContractMetadata<Ty_ = Ty> {
  source: ContractMetadata.Source
  contract: ContractMetadata.Contract
  V3: ContractMetadata.Abi<Ty_>
}
export namespace ContractMetadata {
  // TODO: serde `Value` type
  export type Value = unknown

  export interface Source {
    hash: string
    language: string
    compiler: string
    wasm?: string
  }

  export interface Contract {
    name: string
    version: string
    authors: string[]
    description?: string
    documentation?: string
    repository?: string
    homepage?: string
    license?: string
  }

  export interface User {
    json: Record<string, Value>
  }

  export interface Abi<Ty> {
    spec: Spec
    storage: Storage
    // TODO: type the raw serde-defined shape?
    types: Ty[]
  }

  export interface Spec {
    constructors: Constructor[]
    docs: string[]
    events: Event[]
    messages: Message[]
  }

  export interface Constructor {
    args: Arg[]
    docs: string[]
    label: string
    payable: boolean
    selector: string
  }

  export interface Arg {
    label: string
    type: TypeRef
    docs?: string[]
    indexed?: boolean
  }

  export interface Event {
    args: Arg[]
    docs: string[]
    label: string
  }

  export interface TypeRef {
    displayName: string[]
    type: number
  }

  export interface Message {
    args: Arg[]
    docs: string[]
    label: string
    mutates: boolean
    payable: boolean
    returnType: TypeRef
    selector: string
  }

  export interface Storage {
    struct: {
      fields: {
        layout: {
          cell: {
            key: string
            ty: number
          }
        }
        name: string
      }[]
    }
  }

  // TODO: stricter typings? Not the most necessary atm.
  export function fromRawTy({ type: { def, params, path }, id }: any): Ty {
    return {
      id,
      path,
      params: params ? normalizeFields(params) : [],
      // TODO: grab this from appropriate loc
      docs: [],
      ...((): TyDef => {
        if (def.primitive) {
          return {
            type: "Primitive",
            kind: def.primitive,
          }
        } else if (def.composite) {
          return {
            type: "Struct",
            fields: normalizeFields(def.composite.fields),
          }
        } else if (def.variant) {
          return {
            type: "Union",
            members: def.variant.variants.map((variant: any) => {
              const { fields, ...rest } = variant
              const member: UnionTyDefMember = {
                fields: fields ? normalizeFields(fields) : [],
                ...rest,
              }
              return member
            }),
          }
        } else if (def.tuple) {
          return {
            type: "Tuple",
            fields: def.tuple,
          }
        } else if (def.array) {
          return {
            type: "SizedArray",
            len: def.array.len,
            typeParam: def.array.type,
          }
        } else if (def.sequence) {
          return {
            type: "Sequence",
            typeParam: def.sequence.type,
          }
        } else if (def.compact) {
          return {
            type: "Compact",
            typeParam: def.compact.typeParam,
          }
        } else if (def.bitSequence) {
          return {
            type: "BitSequence",
            bitOrderType: def.bitSequence.bitOrderType,
            bitStoreType: def.bitSequence.bitStoreType,
          }
        }
        unreachable()
      })(),
    }
  }

  function normalizeFields(fields: any[]) {
    return fields.map(({ type: ty, ...rest }: any) => {
      return { ty, ...rest }
    })
  }

  export function normalize(
    { V3: { types, ...v3Rest }, ...topLevelRest }: ContractMetadata,
  ): ContractMetadata<Ty> {
    return {
      ...topLevelRest,
      V3: {
        ...v3Rest,
        types: types.map(fromRawTy),
      },
    }
  }

  export function tys(contractMetadata: ContractMetadata): Ty[] {
    return normalize(contractMetadata).V3.types
  }
}

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
