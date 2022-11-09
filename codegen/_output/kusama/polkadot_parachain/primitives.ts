import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $headData: $.Codec<t.polkadot_parachain.primitives.HeadData> = _codec.$104

export const $hrmpChannelId: $.Codec<t.polkadot_parachain.primitives.HrmpChannelId> = _codec.$112

export const $id: $.Codec<t.polkadot_parachain.primitives.Id> = _codec.$98

export const $validationCode: $.Codec<t.polkadot_parachain.primitives.ValidationCode> = _codec.$394

export const $validationCodeHash: $.Codec<t.polkadot_parachain.primitives.ValidationCodeHash> =
  _codec.$103

export type HeadData = Uint8Array

export function HeadData(value: t.polkadot_parachain.primitives.HeadData) {
  return value
}

export interface HrmpChannelId {
  sender: t.polkadot_parachain.primitives.Id
  recipient: t.polkadot_parachain.primitives.Id
}

export function HrmpChannelId(value: t.polkadot_parachain.primitives.HrmpChannelId) {
  return value
}

export type Id = t.u32

export function Id(value: t.polkadot_parachain.primitives.Id) {
  return value
}

export type ValidationCode = Uint8Array

export function ValidationCode(value: t.polkadot_parachain.primitives.ValidationCode) {
  return value
}

export type ValidationCodeHash = t.primitive_types.H256

export function ValidationCodeHash(value: t.polkadot_parachain.primitives.ValidationCodeHash) {
  return value
}
