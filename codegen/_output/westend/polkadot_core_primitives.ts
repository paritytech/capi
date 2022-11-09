import { $, BitSequence, ChainError, Era } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const $candidateHash: $.Codec<t.polkadot_core_primitives.CandidateHash> = _codec.$114

export const $inboundDownwardMessage: $.Codec<t.polkadot_core_primitives.InboundDownwardMessage> =
  _codec.$683

export const $inboundHrmpMessage: $.Codec<t.polkadot_core_primitives.InboundHrmpMessage> =
  _codec.$691

export const $outboundHrmpMessage: $.Codec<t.polkadot_core_primitives.OutboundHrmpMessage> =
  _codec.$392

export type CandidateHash = t.primitive_types.H256

export function CandidateHash(value: t.polkadot_core_primitives.CandidateHash) {
  return value
}

export interface InboundDownwardMessage {
  sent_at: t.u32
  msg: Uint8Array
}

export function InboundDownwardMessage(value: t.polkadot_core_primitives.InboundDownwardMessage) {
  return value
}

export interface InboundHrmpMessage {
  sent_at: t.u32
  data: Uint8Array
}

export function InboundHrmpMessage(value: t.polkadot_core_primitives.InboundHrmpMessage) {
  return value
}

export interface OutboundHrmpMessage {
  recipient: t.polkadot_parachain.primitives.Id
  data: Uint8Array
}

export function OutboundHrmpMessage(value: t.polkadot_core_primitives.OutboundHrmpMessage) {
  return value
}
