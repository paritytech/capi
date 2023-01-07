import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $ecdsaSignature: $.Codec<types.polkadot_runtime_common.claims.EcdsaSignature> =
  codecs.$245
export type EcdsaSignature = Uint8Array

export function EcdsaSignature(value: types.polkadot_runtime_common.claims.EcdsaSignature) {
  return value
}

export const $ethereumAddress: $.Codec<types.polkadot_runtime_common.claims.EthereumAddress> =
  codecs.$74
export type EthereumAddress = Uint8Array

export function EthereumAddress(value: types.polkadot_runtime_common.claims.EthereumAddress) {
  return value
}

export const $prevalidateAttests: $.Codec<types.polkadot_runtime_common.claims.PrevalidateAttests> =
  codecs.$727
export type PrevalidateAttests = null

export function PrevalidateAttests() {
  return null
}

export const $statementKind: $.Codec<types.polkadot_runtime_common.claims.StatementKind> =
  codecs.$250
export type StatementKind = "Regular" | "Saft"
