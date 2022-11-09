import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** The latest bitfield for each validator, referred to by their index in the validator set. */
export const AvailabilityBitfields = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$385),
  value: _codec.$644,
}

/** Candidates pending availability by `ParaId`. */
export const PendingAvailability = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$645,
}

/** The commitments of candidates pending availability, by `ParaId`. */
export const PendingAvailabilityCommitments = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$390,
}
