import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export type HeadData = Uint8Array

export function HeadData(value: types.polkadot_parachain.primitives.HeadData) {
  return value
}

export interface HrmpChannelId {
  sender: types.polkadot_parachain.primitives.Id
  recipient: types.polkadot_parachain.primitives.Id
}

export function HrmpChannelId(value: types.polkadot_parachain.primitives.HrmpChannelId) {
  return value
}

export type Id = types.u32

export function Id(value: types.polkadot_parachain.primitives.Id) {
  return value
}

export type ValidationCode = Uint8Array

export function ValidationCode(value: types.polkadot_parachain.primitives.ValidationCode) {
  return value
}

export type ValidationCodeHash = types.primitive_types.H256

export function ValidationCodeHash(value: types.polkadot_parachain.primitives.ValidationCodeHash) {
  return value
}
