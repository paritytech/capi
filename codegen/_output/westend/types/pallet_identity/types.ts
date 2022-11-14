import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type Data =
  | types.pallet_identity.types.Data.None
  | types.pallet_identity.types.Data.Raw0
  | types.pallet_identity.types.Data.Raw1
  | types.pallet_identity.types.Data.Raw2
  | types.pallet_identity.types.Data.Raw3
  | types.pallet_identity.types.Data.Raw4
  | types.pallet_identity.types.Data.Raw5
  | types.pallet_identity.types.Data.Raw6
  | types.pallet_identity.types.Data.Raw7
  | types.pallet_identity.types.Data.Raw8
  | types.pallet_identity.types.Data.Raw9
  | types.pallet_identity.types.Data.Raw10
  | types.pallet_identity.types.Data.Raw11
  | types.pallet_identity.types.Data.Raw12
  | types.pallet_identity.types.Data.Raw13
  | types.pallet_identity.types.Data.Raw14
  | types.pallet_identity.types.Data.Raw15
  | types.pallet_identity.types.Data.Raw16
  | types.pallet_identity.types.Data.Raw17
  | types.pallet_identity.types.Data.Raw18
  | types.pallet_identity.types.Data.Raw19
  | types.pallet_identity.types.Data.Raw20
  | types.pallet_identity.types.Data.Raw21
  | types.pallet_identity.types.Data.Raw22
  | types.pallet_identity.types.Data.Raw23
  | types.pallet_identity.types.Data.Raw24
  | types.pallet_identity.types.Data.Raw25
  | types.pallet_identity.types.Data.Raw26
  | types.pallet_identity.types.Data.Raw27
  | types.pallet_identity.types.Data.Raw28
  | types.pallet_identity.types.Data.Raw29
  | types.pallet_identity.types.Data.Raw30
  | types.pallet_identity.types.Data.Raw31
  | types.pallet_identity.types.Data.Raw32
  | types.pallet_identity.types.Data.BlakeTwo256
  | types.pallet_identity.types.Data.Sha256
  | types.pallet_identity.types.Data.Keccak256
  | types.pallet_identity.types.Data.ShaThree256
export namespace Data {
  export interface None {
    type: "None"
  }
  export interface Raw0 {
    type: "Raw0"
    value: Uint8Array
  }
  export interface Raw1 {
    type: "Raw1"
    value: Uint8Array
  }
  export interface Raw2 {
    type: "Raw2"
    value: Uint8Array
  }
  export interface Raw3 {
    type: "Raw3"
    value: Uint8Array
  }
  export interface Raw4 {
    type: "Raw4"
    value: Uint8Array
  }
  export interface Raw5 {
    type: "Raw5"
    value: Uint8Array
  }
  export interface Raw6 {
    type: "Raw6"
    value: Uint8Array
  }
  export interface Raw7 {
    type: "Raw7"
    value: Uint8Array
  }
  export interface Raw8 {
    type: "Raw8"
    value: Uint8Array
  }
  export interface Raw9 {
    type: "Raw9"
    value: Uint8Array
  }
  export interface Raw10 {
    type: "Raw10"
    value: Uint8Array
  }
  export interface Raw11 {
    type: "Raw11"
    value: Uint8Array
  }
  export interface Raw12 {
    type: "Raw12"
    value: Uint8Array
  }
  export interface Raw13 {
    type: "Raw13"
    value: Uint8Array
  }
  export interface Raw14 {
    type: "Raw14"
    value: Uint8Array
  }
  export interface Raw15 {
    type: "Raw15"
    value: Uint8Array
  }
  export interface Raw16 {
    type: "Raw16"
    value: Uint8Array
  }
  export interface Raw17 {
    type: "Raw17"
    value: Uint8Array
  }
  export interface Raw18 {
    type: "Raw18"
    value: Uint8Array
  }
  export interface Raw19 {
    type: "Raw19"
    value: Uint8Array
  }
  export interface Raw20 {
    type: "Raw20"
    value: Uint8Array
  }
  export interface Raw21 {
    type: "Raw21"
    value: Uint8Array
  }
  export interface Raw22 {
    type: "Raw22"
    value: Uint8Array
  }
  export interface Raw23 {
    type: "Raw23"
    value: Uint8Array
  }
  export interface Raw24 {
    type: "Raw24"
    value: Uint8Array
  }
  export interface Raw25 {
    type: "Raw25"
    value: Uint8Array
  }
  export interface Raw26 {
    type: "Raw26"
    value: Uint8Array
  }
  export interface Raw27 {
    type: "Raw27"
    value: Uint8Array
  }
  export interface Raw28 {
    type: "Raw28"
    value: Uint8Array
  }
  export interface Raw29 {
    type: "Raw29"
    value: Uint8Array
  }
  export interface Raw30 {
    type: "Raw30"
    value: Uint8Array
  }
  export interface Raw31 {
    type: "Raw31"
    value: Uint8Array
  }
  export interface Raw32 {
    type: "Raw32"
    value: Uint8Array
  }
  export interface BlakeTwo256 {
    type: "BlakeTwo256"
    value: Uint8Array
  }
  export interface Sha256 {
    type: "Sha256"
    value: Uint8Array
  }
  export interface Keccak256 {
    type: "Keccak256"
    value: Uint8Array
  }
  export interface ShaThree256 {
    type: "ShaThree256"
    value: Uint8Array
  }
  export function None(): types.pallet_identity.types.Data.None {
    return { type: "None" }
  }
  export function Raw0(
    value: types.pallet_identity.types.Data.Raw0["value"],
  ): types.pallet_identity.types.Data.Raw0 {
    return { type: "Raw0", value }
  }
  export function Raw1(
    value: types.pallet_identity.types.Data.Raw1["value"],
  ): types.pallet_identity.types.Data.Raw1 {
    return { type: "Raw1", value }
  }
  export function Raw2(
    value: types.pallet_identity.types.Data.Raw2["value"],
  ): types.pallet_identity.types.Data.Raw2 {
    return { type: "Raw2", value }
  }
  export function Raw3(
    value: types.pallet_identity.types.Data.Raw3["value"],
  ): types.pallet_identity.types.Data.Raw3 {
    return { type: "Raw3", value }
  }
  export function Raw4(
    value: types.pallet_identity.types.Data.Raw4["value"],
  ): types.pallet_identity.types.Data.Raw4 {
    return { type: "Raw4", value }
  }
  export function Raw5(
    value: types.pallet_identity.types.Data.Raw5["value"],
  ): types.pallet_identity.types.Data.Raw5 {
    return { type: "Raw5", value }
  }
  export function Raw6(
    value: types.pallet_identity.types.Data.Raw6["value"],
  ): types.pallet_identity.types.Data.Raw6 {
    return { type: "Raw6", value }
  }
  export function Raw7(
    value: types.pallet_identity.types.Data.Raw7["value"],
  ): types.pallet_identity.types.Data.Raw7 {
    return { type: "Raw7", value }
  }
  export function Raw8(
    value: types.pallet_identity.types.Data.Raw8["value"],
  ): types.pallet_identity.types.Data.Raw8 {
    return { type: "Raw8", value }
  }
  export function Raw9(
    value: types.pallet_identity.types.Data.Raw9["value"],
  ): types.pallet_identity.types.Data.Raw9 {
    return { type: "Raw9", value }
  }
  export function Raw10(
    value: types.pallet_identity.types.Data.Raw10["value"],
  ): types.pallet_identity.types.Data.Raw10 {
    return { type: "Raw10", value }
  }
  export function Raw11(
    value: types.pallet_identity.types.Data.Raw11["value"],
  ): types.pallet_identity.types.Data.Raw11 {
    return { type: "Raw11", value }
  }
  export function Raw12(
    value: types.pallet_identity.types.Data.Raw12["value"],
  ): types.pallet_identity.types.Data.Raw12 {
    return { type: "Raw12", value }
  }
  export function Raw13(
    value: types.pallet_identity.types.Data.Raw13["value"],
  ): types.pallet_identity.types.Data.Raw13 {
    return { type: "Raw13", value }
  }
  export function Raw14(
    value: types.pallet_identity.types.Data.Raw14["value"],
  ): types.pallet_identity.types.Data.Raw14 {
    return { type: "Raw14", value }
  }
  export function Raw15(
    value: types.pallet_identity.types.Data.Raw15["value"],
  ): types.pallet_identity.types.Data.Raw15 {
    return { type: "Raw15", value }
  }
  export function Raw16(
    value: types.pallet_identity.types.Data.Raw16["value"],
  ): types.pallet_identity.types.Data.Raw16 {
    return { type: "Raw16", value }
  }
  export function Raw17(
    value: types.pallet_identity.types.Data.Raw17["value"],
  ): types.pallet_identity.types.Data.Raw17 {
    return { type: "Raw17", value }
  }
  export function Raw18(
    value: types.pallet_identity.types.Data.Raw18["value"],
  ): types.pallet_identity.types.Data.Raw18 {
    return { type: "Raw18", value }
  }
  export function Raw19(
    value: types.pallet_identity.types.Data.Raw19["value"],
  ): types.pallet_identity.types.Data.Raw19 {
    return { type: "Raw19", value }
  }
  export function Raw20(
    value: types.pallet_identity.types.Data.Raw20["value"],
  ): types.pallet_identity.types.Data.Raw20 {
    return { type: "Raw20", value }
  }
  export function Raw21(
    value: types.pallet_identity.types.Data.Raw21["value"],
  ): types.pallet_identity.types.Data.Raw21 {
    return { type: "Raw21", value }
  }
  export function Raw22(
    value: types.pallet_identity.types.Data.Raw22["value"],
  ): types.pallet_identity.types.Data.Raw22 {
    return { type: "Raw22", value }
  }
  export function Raw23(
    value: types.pallet_identity.types.Data.Raw23["value"],
  ): types.pallet_identity.types.Data.Raw23 {
    return { type: "Raw23", value }
  }
  export function Raw24(
    value: types.pallet_identity.types.Data.Raw24["value"],
  ): types.pallet_identity.types.Data.Raw24 {
    return { type: "Raw24", value }
  }
  export function Raw25(
    value: types.pallet_identity.types.Data.Raw25["value"],
  ): types.pallet_identity.types.Data.Raw25 {
    return { type: "Raw25", value }
  }
  export function Raw26(
    value: types.pallet_identity.types.Data.Raw26["value"],
  ): types.pallet_identity.types.Data.Raw26 {
    return { type: "Raw26", value }
  }
  export function Raw27(
    value: types.pallet_identity.types.Data.Raw27["value"],
  ): types.pallet_identity.types.Data.Raw27 {
    return { type: "Raw27", value }
  }
  export function Raw28(
    value: types.pallet_identity.types.Data.Raw28["value"],
  ): types.pallet_identity.types.Data.Raw28 {
    return { type: "Raw28", value }
  }
  export function Raw29(
    value: types.pallet_identity.types.Data.Raw29["value"],
  ): types.pallet_identity.types.Data.Raw29 {
    return { type: "Raw29", value }
  }
  export function Raw30(
    value: types.pallet_identity.types.Data.Raw30["value"],
  ): types.pallet_identity.types.Data.Raw30 {
    return { type: "Raw30", value }
  }
  export function Raw31(
    value: types.pallet_identity.types.Data.Raw31["value"],
  ): types.pallet_identity.types.Data.Raw31 {
    return { type: "Raw31", value }
  }
  export function Raw32(
    value: types.pallet_identity.types.Data.Raw32["value"],
  ): types.pallet_identity.types.Data.Raw32 {
    return { type: "Raw32", value }
  }
  export function BlakeTwo256(
    value: types.pallet_identity.types.Data.BlakeTwo256["value"],
  ): types.pallet_identity.types.Data.BlakeTwo256 {
    return { type: "BlakeTwo256", value }
  }
  export function Sha256(
    value: types.pallet_identity.types.Data.Sha256["value"],
  ): types.pallet_identity.types.Data.Sha256 {
    return { type: "Sha256", value }
  }
  export function Keccak256(
    value: types.pallet_identity.types.Data.Keccak256["value"],
  ): types.pallet_identity.types.Data.Keccak256 {
    return { type: "Keccak256", value }
  }
  export function ShaThree256(
    value: types.pallet_identity.types.Data.ShaThree256["value"],
  ): types.pallet_identity.types.Data.ShaThree256 {
    return { type: "ShaThree256", value }
  }
}

export type IdentityField =
  | "Display"
  | "Legal"
  | "Web"
  | "Riot"
  | "Email"
  | "PgpFingerprint"
  | "Image"
  | "Twitter"

export interface IdentityInfo {
  additional: Array<[types.pallet_identity.types.Data, types.pallet_identity.types.Data]>
  display: types.pallet_identity.types.Data
  legal: types.pallet_identity.types.Data
  web: types.pallet_identity.types.Data
  riot: types.pallet_identity.types.Data
  email: types.pallet_identity.types.Data
  pgp_fingerprint: Uint8Array | undefined
  image: types.pallet_identity.types.Data
  twitter: types.pallet_identity.types.Data
}

export function IdentityInfo(value: types.pallet_identity.types.IdentityInfo) {
  return value
}

export type Judgement =
  | types.pallet_identity.types.Judgement.Unknown
  | types.pallet_identity.types.Judgement.FeePaid
  | types.pallet_identity.types.Judgement.Reasonable
  | types.pallet_identity.types.Judgement.KnownGood
  | types.pallet_identity.types.Judgement.OutOfDate
  | types.pallet_identity.types.Judgement.LowQuality
  | types.pallet_identity.types.Judgement.Erroneous
export namespace Judgement {
  export interface Unknown {
    type: "Unknown"
  }
  export interface FeePaid {
    type: "FeePaid"
    value: types.u128
  }
  export interface Reasonable {
    type: "Reasonable"
  }
  export interface KnownGood {
    type: "KnownGood"
  }
  export interface OutOfDate {
    type: "OutOfDate"
  }
  export interface LowQuality {
    type: "LowQuality"
  }
  export interface Erroneous {
    type: "Erroneous"
  }
  export function Unknown(): types.pallet_identity.types.Judgement.Unknown {
    return { type: "Unknown" }
  }
  export function FeePaid(
    value: types.pallet_identity.types.Judgement.FeePaid["value"],
  ): types.pallet_identity.types.Judgement.FeePaid {
    return { type: "FeePaid", value }
  }
  export function Reasonable(): types.pallet_identity.types.Judgement.Reasonable {
    return { type: "Reasonable" }
  }
  export function KnownGood(): types.pallet_identity.types.Judgement.KnownGood {
    return { type: "KnownGood" }
  }
  export function OutOfDate(): types.pallet_identity.types.Judgement.OutOfDate {
    return { type: "OutOfDate" }
  }
  export function LowQuality(): types.pallet_identity.types.Judgement.LowQuality {
    return { type: "LowQuality" }
  }
  export function Erroneous(): types.pallet_identity.types.Judgement.Erroneous {
    return { type: "Erroneous" }
  }
}

export interface RegistrarInfo {
  account: types.sp_core.crypto.AccountId32
  fee: types.u128
  fields: types.u64
}

export function RegistrarInfo(value: types.pallet_identity.types.RegistrarInfo) {
  return value
}

export interface Registration {
  judgements: Array<[types.u32, types.pallet_identity.types.Judgement]>
  deposit: types.u128
  info: types.pallet_identity.types.IdentityInfo
}

export function Registration(value: types.pallet_identity.types.Registration) {
  return value
}
