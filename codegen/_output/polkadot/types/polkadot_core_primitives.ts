import { $, C } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "./mod.ts"

export type CandidateHash = types.primitive_types.H256

export function CandidateHash(value: types.polkadot_core_primitives.CandidateHash) {
  return value
}

export interface InboundDownwardMessage {
  sent_at: types.u32
  msg: Uint8Array
}

export function InboundDownwardMessage(
  value: types.polkadot_core_primitives.InboundDownwardMessage,
) {
  return value
}

export interface InboundHrmpMessage {
  sent_at: types.u32
  data: Uint8Array
}

export function InboundHrmpMessage(value: types.polkadot_core_primitives.InboundHrmpMessage) {
  return value
}

export interface OutboundHrmpMessage {
  recipient: types.polkadot_parachain.primitives.Id
  data: Uint8Array
}

export function OutboundHrmpMessage(value: types.polkadot_core_primitives.OutboundHrmpMessage) {
  return value
}
