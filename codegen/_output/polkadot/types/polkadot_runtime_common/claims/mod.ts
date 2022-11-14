import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export type EcdsaSignature = Uint8Array

export function EcdsaSignature(value: types.polkadot_runtime_common.claims.EcdsaSignature) {
  return value
}

export type EthereumAddress = Uint8Array

export function EthereumAddress(value: types.polkadot_runtime_common.claims.EthereumAddress) {
  return value
}

export type PrevalidateAttests = null

export function PrevalidateAttests() {
  return null
}

export type StatementKind = "Regular" | "Saft"
