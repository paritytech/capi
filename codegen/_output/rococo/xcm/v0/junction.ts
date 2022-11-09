import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $bodyId: $.Codec<t.xcm.v0.junction.BodyId> = _codec.$128

export const $bodyPart: $.Codec<t.xcm.v0.junction.BodyPart> = _codec.$129

export const $junction: $.Codec<t.xcm.v0.junction.Junction> = _codec.$154

export const $networkId: $.Codec<t.xcm.v0.junction.NetworkId> = _codec.$126

export type BodyId =
  | t.xcm.v0.junction.BodyId.Unit
  | t.xcm.v0.junction.BodyId.Named
  | t.xcm.v0.junction.BodyId.Index
  | t.xcm.v0.junction.BodyId.Executive
  | t.xcm.v0.junction.BodyId.Technical
  | t.xcm.v0.junction.BodyId.Legislative
  | t.xcm.v0.junction.BodyId.Judicial
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
    value: t.Compact<t.u32>
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
  export function Unit(): t.xcm.v0.junction.BodyId.Unit {
    return { type: "Unit" }
  }
  export function Named(
    value: t.xcm.v0.junction.BodyId.Named["value"],
  ): t.xcm.v0.junction.BodyId.Named {
    return { type: "Named", value }
  }
  export function Index(
    value: t.xcm.v0.junction.BodyId.Index["value"],
  ): t.xcm.v0.junction.BodyId.Index {
    return { type: "Index", value }
  }
  export function Executive(): t.xcm.v0.junction.BodyId.Executive {
    return { type: "Executive" }
  }
  export function Technical(): t.xcm.v0.junction.BodyId.Technical {
    return { type: "Technical" }
  }
  export function Legislative(): t.xcm.v0.junction.BodyId.Legislative {
    return { type: "Legislative" }
  }
  export function Judicial(): t.xcm.v0.junction.BodyId.Judicial {
    return { type: "Judicial" }
  }
}

export type BodyPart =
  | t.xcm.v0.junction.BodyPart.Voice
  | t.xcm.v0.junction.BodyPart.Members
  | t.xcm.v0.junction.BodyPart.Fraction
  | t.xcm.v0.junction.BodyPart.AtLeastProportion
  | t.xcm.v0.junction.BodyPart.MoreThanProportion
export namespace BodyPart {
  export interface Voice {
    type: "Voice"
  }
  export interface Members {
    type: "Members"
    count: t.Compact<t.u32>
  }
  export interface Fraction {
    type: "Fraction"
    nom: t.Compact<t.u32>
    denom: t.Compact<t.u32>
  }
  export interface AtLeastProportion {
    type: "AtLeastProportion"
    nom: t.Compact<t.u32>
    denom: t.Compact<t.u32>
  }
  export interface MoreThanProportion {
    type: "MoreThanProportion"
    nom: t.Compact<t.u32>
    denom: t.Compact<t.u32>
  }
  export function Voice(): t.xcm.v0.junction.BodyPart.Voice {
    return { type: "Voice" }
  }
  export function Members(
    value: Omit<t.xcm.v0.junction.BodyPart.Members, "type">,
  ): t.xcm.v0.junction.BodyPart.Members {
    return { type: "Members", ...value }
  }
  export function Fraction(
    value: Omit<t.xcm.v0.junction.BodyPart.Fraction, "type">,
  ): t.xcm.v0.junction.BodyPart.Fraction {
    return { type: "Fraction", ...value }
  }
  export function AtLeastProportion(
    value: Omit<t.xcm.v0.junction.BodyPart.AtLeastProportion, "type">,
  ): t.xcm.v0.junction.BodyPart.AtLeastProportion {
    return { type: "AtLeastProportion", ...value }
  }
  export function MoreThanProportion(
    value: Omit<t.xcm.v0.junction.BodyPart.MoreThanProportion, "type">,
  ): t.xcm.v0.junction.BodyPart.MoreThanProportion {
    return { type: "MoreThanProportion", ...value }
  }
}

export type Junction =
  | t.xcm.v0.junction.Junction.Parent
  | t.xcm.v0.junction.Junction.Parachain
  | t.xcm.v0.junction.Junction.AccountId32
  | t.xcm.v0.junction.Junction.AccountIndex64
  | t.xcm.v0.junction.Junction.AccountKey20
  | t.xcm.v0.junction.Junction.PalletInstance
  | t.xcm.v0.junction.Junction.GeneralIndex
  | t.xcm.v0.junction.Junction.GeneralKey
  | t.xcm.v0.junction.Junction.OnlyChild
  | t.xcm.v0.junction.Junction.Plurality
export namespace Junction {
  export interface Parent {
    type: "Parent"
  }
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
  export function Parent(): t.xcm.v0.junction.Junction.Parent {
    return { type: "Parent" }
  }
  export function Parachain(
    value: t.xcm.v0.junction.Junction.Parachain["value"],
  ): t.xcm.v0.junction.Junction.Parachain {
    return { type: "Parachain", value }
  }
  export function AccountId32(
    value: Omit<t.xcm.v0.junction.Junction.AccountId32, "type">,
  ): t.xcm.v0.junction.Junction.AccountId32 {
    return { type: "AccountId32", ...value }
  }
  export function AccountIndex64(
    value: Omit<t.xcm.v0.junction.Junction.AccountIndex64, "type">,
  ): t.xcm.v0.junction.Junction.AccountIndex64 {
    return { type: "AccountIndex64", ...value }
  }
  export function AccountKey20(
    value: Omit<t.xcm.v0.junction.Junction.AccountKey20, "type">,
  ): t.xcm.v0.junction.Junction.AccountKey20 {
    return { type: "AccountKey20", ...value }
  }
  export function PalletInstance(
    value: t.xcm.v0.junction.Junction.PalletInstance["value"],
  ): t.xcm.v0.junction.Junction.PalletInstance {
    return { type: "PalletInstance", value }
  }
  export function GeneralIndex(
    value: t.xcm.v0.junction.Junction.GeneralIndex["value"],
  ): t.xcm.v0.junction.Junction.GeneralIndex {
    return { type: "GeneralIndex", value }
  }
  export function GeneralKey(
    value: t.xcm.v0.junction.Junction.GeneralKey["value"],
  ): t.xcm.v0.junction.Junction.GeneralKey {
    return { type: "GeneralKey", value }
  }
  export function OnlyChild(): t.xcm.v0.junction.Junction.OnlyChild {
    return { type: "OnlyChild" }
  }
  export function Plurality(
    value: Omit<t.xcm.v0.junction.Junction.Plurality, "type">,
  ): t.xcm.v0.junction.Junction.Plurality {
    return { type: "Plurality", ...value }
  }
}

export type NetworkId =
  | t.xcm.v0.junction.NetworkId.Any
  | t.xcm.v0.junction.NetworkId.Named
  | t.xcm.v0.junction.NetworkId.Polkadot
  | t.xcm.v0.junction.NetworkId.Kusama
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
  export function Any(): t.xcm.v0.junction.NetworkId.Any {
    return { type: "Any" }
  }
  export function Named(
    value: t.xcm.v0.junction.NetworkId.Named["value"],
  ): t.xcm.v0.junction.NetworkId.Named {
    return { type: "Named", value }
  }
  export function Polkadot(): t.xcm.v0.junction.NetworkId.Polkadot {
    return { type: "Polkadot" }
  }
  export function Kusama(): t.xcm.v0.junction.NetworkId.Kusama {
    return { type: "Kusama" }
  }
}
