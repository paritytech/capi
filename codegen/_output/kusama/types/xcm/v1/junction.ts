import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export type Junction =
  | types.xcm.v1.junction.Junction.Parachain
  | types.xcm.v1.junction.Junction.AccountId32
  | types.xcm.v1.junction.Junction.AccountIndex64
  | types.xcm.v1.junction.Junction.AccountKey20
  | types.xcm.v1.junction.Junction.PalletInstance
  | types.xcm.v1.junction.Junction.GeneralIndex
  | types.xcm.v1.junction.Junction.GeneralKey
  | types.xcm.v1.junction.Junction.OnlyChild
  | types.xcm.v1.junction.Junction.Plurality
export namespace Junction {
  export interface Parachain {
    type: "Parachain"
    value: types.Compact<types.u32>
  }
  export interface AccountId32 {
    type: "AccountId32"
    network: types.xcm.v0.junction.NetworkId
    id: Uint8Array
  }
  export interface AccountIndex64 {
    type: "AccountIndex64"
    network: types.xcm.v0.junction.NetworkId
    index: types.Compact<types.u64>
  }
  export interface AccountKey20 {
    type: "AccountKey20"
    network: types.xcm.v0.junction.NetworkId
    key: Uint8Array
  }
  export interface PalletInstance {
    type: "PalletInstance"
    value: types.u8
  }
  export interface GeneralIndex {
    type: "GeneralIndex"
    value: types.Compact<types.u128>
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
    id: types.xcm.v0.junction.BodyId
    part: types.xcm.v0.junction.BodyPart
  }
  export function Parachain(
    value: types.xcm.v1.junction.Junction.Parachain["value"],
  ): types.xcm.v1.junction.Junction.Parachain {
    return { type: "Parachain", value }
  }
  export function AccountId32(
    value: Omit<types.xcm.v1.junction.Junction.AccountId32, "type">,
  ): types.xcm.v1.junction.Junction.AccountId32 {
    return { type: "AccountId32", ...value }
  }
  export function AccountIndex64(
    value: Omit<types.xcm.v1.junction.Junction.AccountIndex64, "type">,
  ): types.xcm.v1.junction.Junction.AccountIndex64 {
    return { type: "AccountIndex64", ...value }
  }
  export function AccountKey20(
    value: Omit<types.xcm.v1.junction.Junction.AccountKey20, "type">,
  ): types.xcm.v1.junction.Junction.AccountKey20 {
    return { type: "AccountKey20", ...value }
  }
  export function PalletInstance(
    value: types.xcm.v1.junction.Junction.PalletInstance["value"],
  ): types.xcm.v1.junction.Junction.PalletInstance {
    return { type: "PalletInstance", value }
  }
  export function GeneralIndex(
    value: types.xcm.v1.junction.Junction.GeneralIndex["value"],
  ): types.xcm.v1.junction.Junction.GeneralIndex {
    return { type: "GeneralIndex", value }
  }
  export function GeneralKey(
    value: types.xcm.v1.junction.Junction.GeneralKey["value"],
  ): types.xcm.v1.junction.Junction.GeneralKey {
    return { type: "GeneralKey", value }
  }
  export function OnlyChild(): types.xcm.v1.junction.Junction.OnlyChild {
    return { type: "OnlyChild" }
  }
  export function Plurality(
    value: Omit<types.xcm.v1.junction.Junction.Plurality, "type">,
  ): types.xcm.v1.junction.Junction.Plurality {
    return { type: "Plurality", ...value }
  }
}
