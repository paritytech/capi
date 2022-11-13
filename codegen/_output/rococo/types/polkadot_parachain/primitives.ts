import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $headData: $.Codec<types.polkadot_parachain.primitives.HeadData> = _codec.$104

export const $hrmpChannelId: $.Codec<types.polkadot_parachain.primitives.HrmpChannelId> =
  _codec.$112

export const $id: $.Codec<types.polkadot_parachain.primitives.Id> = _codec.$98

export const $validationCode: $.Codec<types.polkadot_parachain.primitives.ValidationCode> =
  _codec.$394

export const $validationCodeHash: $.Codec<types.polkadot_parachain.primitives.ValidationCodeHash> =
  _codec.$103

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
