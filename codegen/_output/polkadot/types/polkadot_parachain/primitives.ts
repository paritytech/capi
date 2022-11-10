import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $headData: $.Codec<t.types.polkadot_parachain.primitives.HeadData> = _codec.$104

export const $hrmpChannelId: $.Codec<t.types.polkadot_parachain.primitives.HrmpChannelId> =
  _codec.$112

export const $id: $.Codec<t.types.polkadot_parachain.primitives.Id> = _codec.$98

export const $validationCode: $.Codec<t.types.polkadot_parachain.primitives.ValidationCode> =
  _codec.$394

export const $validationCodeHash: $.Codec<
  t.types.polkadot_parachain.primitives.ValidationCodeHash
> = _codec.$103

export type HeadData = Uint8Array

export function HeadData(value: t.types.polkadot_parachain.primitives.HeadData) {
  return value
}

export interface HrmpChannelId {
  sender: t.types.polkadot_parachain.primitives.Id
  recipient: t.types.polkadot_parachain.primitives.Id
}

export function HrmpChannelId(value: t.types.polkadot_parachain.primitives.HrmpChannelId) {
  return value
}

export type Id = t.types.u32

export function Id(value: t.types.polkadot_parachain.primitives.Id) {
  return value
}

export type ValidationCode = Uint8Array

export function ValidationCode(value: t.types.polkadot_parachain.primitives.ValidationCode) {
  return value
}

export type ValidationCodeHash = t.types.primitive_types.H256

export function ValidationCodeHash(
  value: t.types.polkadot_parachain.primitives.ValidationCodeHash,
) {
  return value
}
