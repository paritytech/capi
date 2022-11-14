import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The latest bitfield for each validator, referred to by their index in the validator set. */
export const AvailabilityBitfields = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaInclusion",
  "AvailabilityBitfields",
  $.tuple(_codec.$385),
  _codec.$644,
)

/** Candidates pending availability by `ParaId`. */
export const PendingAvailability = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaInclusion",
  "PendingAvailability",
  $.tuple(_codec.$98),
  _codec.$645,
)

/** The commitments of candidates pending availability, by `ParaId`. */
export const PendingAvailabilityCommitments = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaInclusion",
  "PendingAvailabilityCommitments",
  $.tuple(_codec.$98),
  _codec.$390,
)
