import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export const $candidateHash: $.Codec<types.polkadot_core_primitives.CandidateHash> = codecs.$113
export type CandidateHash = types.primitive_types.H256

export function CandidateHash(value: types.polkadot_core_primitives.CandidateHash) {
  return value
}

export const $inboundDownwardMessage: $.Codec<
  types.polkadot_core_primitives.InboundDownwardMessage
> = codecs.$675
export interface InboundDownwardMessage {
  sentAt: types.u32
  msg: Uint8Array
}

export function InboundDownwardMessage(
  value: types.polkadot_core_primitives.InboundDownwardMessage,
) {
  return value
}

export const $inboundHrmpMessage: $.Codec<types.polkadot_core_primitives.InboundHrmpMessage> =
  codecs.$683
export interface InboundHrmpMessage {
  sentAt: types.u32
  data: Uint8Array
}

export function InboundHrmpMessage(value: types.polkadot_core_primitives.InboundHrmpMessage) {
  return value
}

export const $outboundHrmpMessage: $.Codec<types.polkadot_core_primitives.OutboundHrmpMessage> =
  codecs.$391
export interface OutboundHrmpMessage {
  recipient: types.polkadot_parachain.primitives.Id
  data: Uint8Array
}

export function OutboundHrmpMessage(value: types.polkadot_core_primitives.OutboundHrmpMessage) {
  return value
}
