import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $bodyId: $.Codec<types.xcm.v0.junction.BodyId> = codecs.$128
export type BodyId =
  | types.xcm.v0.junction.BodyId.Unit
  | types.xcm.v0.junction.BodyId.Named
  | types.xcm.v0.junction.BodyId.Index
  | types.xcm.v0.junction.BodyId.Executive
  | types.xcm.v0.junction.BodyId.Technical
  | types.xcm.v0.junction.BodyId.Legislative
  | types.xcm.v0.junction.BodyId.Judicial
export namespace BodyId {
  export interface Unit {
    type: "Unit"
  }
  export interface Named {
    type: "Named"
    value: Uint8Array
  }
  export interface Index {
    type: "Index"
    value: types.Compact<types.u32>
  }
  export interface Executive {
    type: "Executive"
  }
  export interface Technical {
    type: "Technical"
  }
  export interface Legislative {
    type: "Legislative"
  }
  export interface Judicial {
    type: "Judicial"
  }
  export function Unit(): types.xcm.v0.junction.BodyId.Unit {
    return { type: "Unit" }
  }
  export function Named(
    value: types.xcm.v0.junction.BodyId.Named["value"],
  ): types.xcm.v0.junction.BodyId.Named {
    return { type: "Named", value }
  }
  export function Index(
    value: types.xcm.v0.junction.BodyId.Index["value"],
  ): types.xcm.v0.junction.BodyId.Index {
    return { type: "Index", value }
  }
  export function Executive(): types.xcm.v0.junction.BodyId.Executive {
    return { type: "Executive" }
  }
  export function Technical(): types.xcm.v0.junction.BodyId.Technical {
    return { type: "Technical" }
  }
  export function Legislative(): types.xcm.v0.junction.BodyId.Legislative {
    return { type: "Legislative" }
  }
  export function Judicial(): types.xcm.v0.junction.BodyId.Judicial {
    return { type: "Judicial" }
  }
}

export const $bodyPart: $.Codec<types.xcm.v0.junction.BodyPart> = codecs.$129
export type BodyPart =
  | types.xcm.v0.junction.BodyPart.Voice
  | types.xcm.v0.junction.BodyPart.Members
  | types.xcm.v0.junction.BodyPart.Fraction
  | types.xcm.v0.junction.BodyPart.AtLeastProportion
  | types.xcm.v0.junction.BodyPart.MoreThanProportion
export namespace BodyPart {
  export interface Voice {
    type: "Voice"
  }
  export interface Members {
    type: "Members"
    count: types.Compact<types.u32>
  }
  export interface Fraction {
    type: "Fraction"
    nom: types.Compact<types.u32>
    denom: types.Compact<types.u32>
  }
  export interface AtLeastProportion {
    type: "AtLeastProportion"
    nom: types.Compact<types.u32>
    denom: types.Compact<types.u32>
  }
  export interface MoreThanProportion {
    type: "MoreThanProportion"
    nom: types.Compact<types.u32>
    denom: types.Compact<types.u32>
  }
  export function Voice(): types.xcm.v0.junction.BodyPart.Voice {
    return { type: "Voice" }
  }
  export function Members(
    value: Omit<types.xcm.v0.junction.BodyPart.Members, "type">,
  ): types.xcm.v0.junction.BodyPart.Members {
    return { type: "Members", ...value }
  }
  export function Fraction(
    value: Omit<types.xcm.v0.junction.BodyPart.Fraction, "type">,
  ): types.xcm.v0.junction.BodyPart.Fraction {
    return { type: "Fraction", ...value }
  }
  export function AtLeastProportion(
    value: Omit<types.xcm.v0.junction.BodyPart.AtLeastProportion, "type">,
  ): types.xcm.v0.junction.BodyPart.AtLeastProportion {
    return { type: "AtLeastProportion", ...value }
  }
  export function MoreThanProportion(
    value: Omit<types.xcm.v0.junction.BodyPart.MoreThanProportion, "type">,
  ): types.xcm.v0.junction.BodyPart.MoreThanProportion {
    return { type: "MoreThanProportion", ...value }
  }
}

export const $junction: $.Codec<types.xcm.v0.junction.Junction> = codecs.$154
export type Junction =
  | types.xcm.v0.junction.Junction.Parent
  | types.xcm.v0.junction.Junction.Parachain
  | types.xcm.v0.junction.Junction.AccountId32
  | types.xcm.v0.junction.Junction.AccountIndex64
  | types.xcm.v0.junction.Junction.AccountKey20
  | types.xcm.v0.junction.Junction.PalletInstance
  | types.xcm.v0.junction.Junction.GeneralIndex
  | types.xcm.v0.junction.Junction.GeneralKey
  | types.xcm.v0.junction.Junction.OnlyChild
  | types.xcm.v0.junction.Junction.Plurality
export namespace Junction {
  export interface Parent {
    type: "Parent"
  }
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
  export function Parent(): types.xcm.v0.junction.Junction.Parent {
    return { type: "Parent" }
  }
  export function Parachain(
    value: types.xcm.v0.junction.Junction.Parachain["value"],
  ): types.xcm.v0.junction.Junction.Parachain {
    return { type: "Parachain", value }
  }
  export function AccountId32(
    value: Omit<types.xcm.v0.junction.Junction.AccountId32, "type">,
  ): types.xcm.v0.junction.Junction.AccountId32 {
    return { type: "AccountId32", ...value }
  }
  export function AccountIndex64(
    value: Omit<types.xcm.v0.junction.Junction.AccountIndex64, "type">,
  ): types.xcm.v0.junction.Junction.AccountIndex64 {
    return { type: "AccountIndex64", ...value }
  }
  export function AccountKey20(
    value: Omit<types.xcm.v0.junction.Junction.AccountKey20, "type">,
  ): types.xcm.v0.junction.Junction.AccountKey20 {
    return { type: "AccountKey20", ...value }
  }
  export function PalletInstance(
    value: types.xcm.v0.junction.Junction.PalletInstance["value"],
  ): types.xcm.v0.junction.Junction.PalletInstance {
    return { type: "PalletInstance", value }
  }
  export function GeneralIndex(
    value: types.xcm.v0.junction.Junction.GeneralIndex["value"],
  ): types.xcm.v0.junction.Junction.GeneralIndex {
    return { type: "GeneralIndex", value }
  }
  export function GeneralKey(
    value: types.xcm.v0.junction.Junction.GeneralKey["value"],
  ): types.xcm.v0.junction.Junction.GeneralKey {
    return { type: "GeneralKey", value }
  }
  export function OnlyChild(): types.xcm.v0.junction.Junction.OnlyChild {
    return { type: "OnlyChild" }
  }
  export function Plurality(
    value: Omit<types.xcm.v0.junction.Junction.Plurality, "type">,
  ): types.xcm.v0.junction.Junction.Plurality {
    return { type: "Plurality", ...value }
  }
}

export const $networkId: $.Codec<types.xcm.v0.junction.NetworkId> = codecs.$125
export type NetworkId =
  | types.xcm.v0.junction.NetworkId.Any
  | types.xcm.v0.junction.NetworkId.Named
  | types.xcm.v0.junction.NetworkId.Polkadot
  | types.xcm.v0.junction.NetworkId.Kusama
export namespace NetworkId {
  export interface Any {
    type: "Any"
  }
  export interface Named {
    type: "Named"
    value: Uint8Array
  }
  export interface Polkadot {
    type: "Polkadot"
  }
  export interface Kusama {
    type: "Kusama"
  }
  export function Any(): types.xcm.v0.junction.NetworkId.Any {
    return { type: "Any" }
  }
  export function Named(
    value: types.xcm.v0.junction.NetworkId.Named["value"],
  ): types.xcm.v0.junction.NetworkId.Named {
    return { type: "Named", value }
  }
  export function Polkadot(): types.xcm.v0.junction.NetworkId.Polkadot {
    return { type: "Polkadot" }
  }
  export function Kusama(): types.xcm.v0.junction.NetworkId.Kusama {
    return { type: "Kusama" }
  }
}
