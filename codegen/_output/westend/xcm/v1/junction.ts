import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $junction: $.Codec<t.xcm.v1.junction.Junction> = _codec.$124

export type Junction =
  | t.xcm.v1.junction.Junction.Parachain
  | t.xcm.v1.junction.Junction.AccountId32
  | t.xcm.v1.junction.Junction.AccountIndex64
  | t.xcm.v1.junction.Junction.AccountKey20
  | t.xcm.v1.junction.Junction.PalletInstance
  | t.xcm.v1.junction.Junction.GeneralIndex
  | t.xcm.v1.junction.Junction.GeneralKey
  | t.xcm.v1.junction.Junction.OnlyChild
  | t.xcm.v1.junction.Junction.Plurality
export namespace Junction {
  export interface Parachain {
    type: "Parachain"
    value: t.Compact<t.u32>
  }
  export interface AccountId32 {
    type: "AccountId32"
    network: t.xcm.v0.junction.NetworkId
    id: Uint8Array
  }
  export interface AccountIndex64 {
    type: "AccountIndex64"
    network: t.xcm.v0.junction.NetworkId
    index: t.Compact<t.u64>
  }
  export interface AccountKey20 {
    type: "AccountKey20"
    network: t.xcm.v0.junction.NetworkId
    key: Uint8Array
  }
  export interface PalletInstance {
    type: "PalletInstance"
    value: t.u8
  }
  export interface GeneralIndex {
    type: "GeneralIndex"
    value: t.Compact<t.u128>
  }
  export interface GeneralKey {
    type: "GeneralKey"
    value: Uint8Array
  }
  export interface OnlyChild {
    type: "OnlyChild"
  }
  export interface Plurality {
    type: "Plurality"
    id: t.xcm.v0.junction.BodyId
    part: t.xcm.v0.junction.BodyPart
  }
  export function Parachain(
    value: t.xcm.v1.junction.Junction.Parachain["value"],
  ): t.xcm.v1.junction.Junction.Parachain {
    return { type: "Parachain", value }
  }
  export function AccountId32(
    value: Omit<t.xcm.v1.junction.Junction.AccountId32, "type">,
  ): t.xcm.v1.junction.Junction.AccountId32 {
    return { type: "AccountId32", ...value }
  }
  export function AccountIndex64(
    value: Omit<t.xcm.v1.junction.Junction.AccountIndex64, "type">,
  ): t.xcm.v1.junction.Junction.AccountIndex64 {
    return { type: "AccountIndex64", ...value }
  }
  export function AccountKey20(
    value: Omit<t.xcm.v1.junction.Junction.AccountKey20, "type">,
  ): t.xcm.v1.junction.Junction.AccountKey20 {
    return { type: "AccountKey20", ...value }
  }
  export function PalletInstance(
    value: t.xcm.v1.junction.Junction.PalletInstance["value"],
  ): t.xcm.v1.junction.Junction.PalletInstance {
    return { type: "PalletInstance", value }
  }
  export function GeneralIndex(
    value: t.xcm.v1.junction.Junction.GeneralIndex["value"],
  ): t.xcm.v1.junction.Junction.GeneralIndex {
    return { type: "GeneralIndex", value }
  }
  export function GeneralKey(
    value: t.xcm.v1.junction.Junction.GeneralKey["value"],
  ): t.xcm.v1.junction.Junction.GeneralKey {
    return { type: "GeneralKey", value }
  }
  export function OnlyChild(): t.xcm.v1.junction.Junction.OnlyChild {
    return { type: "OnlyChild" }
  }
  export function Plurality(
    value: Omit<t.xcm.v1.junction.Junction.Plurality, "type">,
  ): t.xcm.v1.junction.Junction.Plurality {
    return { type: "Plurality", ...value }
  }
}
