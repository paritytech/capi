import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $headData: $.Codec<types.polkadot_parachain.primitives.HeadData> = codecs.$103
export type HeadData = Uint8Array

export function HeadData(value: types.polkadot_parachain.primitives.HeadData) {
  return value
}

export const $hrmpChannelId: $.Codec<types.polkadot_parachain.primitives.HrmpChannelId> =
  codecs.$111
export interface HrmpChannelId {
  sender: types.polkadot_parachain.primitives.Id
  recipient: types.polkadot_parachain.primitives.Id
}

export function HrmpChannelId(value: types.polkadot_parachain.primitives.HrmpChannelId) {
  return value
}

export const $id: $.Codec<types.polkadot_parachain.primitives.Id> = codecs.$97
export type Id = types.u32

export function Id(value: types.polkadot_parachain.primitives.Id) {
  return value
}

export const $validationCode: $.Codec<types.polkadot_parachain.primitives.ValidationCode> =
  codecs.$393
export type ValidationCode = Uint8Array

export function ValidationCode(value: types.polkadot_parachain.primitives.ValidationCode) {
  return value
}

export const $validationCodeHash: $.Codec<types.polkadot_parachain.primitives.ValidationCodeHash> =
  codecs.$102
export type ValidationCodeHash = types.primitive_types.H256

export function ValidationCodeHash(value: types.polkadot_parachain.primitives.ValidationCodeHash) {
  return value
}
