import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $ecdsaSignature: $.Codec<t.polkadot_runtime_common.claims.EcdsaSignature> = _codec.$246

export const $ethereumAddress: $.Codec<t.polkadot_runtime_common.claims.EthereumAddress> =
  _codec.$73

export const $prevalidateAttests: $.Codec<t.polkadot_runtime_common.claims.PrevalidateAttests> =
  _codec.$736

export const $statementKind: $.Codec<t.polkadot_runtime_common.claims.StatementKind> = _codec.$251

export type EcdsaSignature = Uint8Array

export function EcdsaSignature(value: t.polkadot_runtime_common.claims.EcdsaSignature) {
  return value
}

export type EthereumAddress = Uint8Array

export function EthereumAddress(value: t.polkadot_runtime_common.claims.EthereumAddress) {
  return value
}

export function PrevalidateAttests() {
  return null
}

export type PrevalidateAttests = null

export type StatementKind = "Regular" | "Saft"
