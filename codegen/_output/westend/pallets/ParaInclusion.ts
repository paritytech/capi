import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The latest bitfield for each validator, referred to by their index in the validator set. */
export const AvailabilityBitfields = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaInclusion",
  "AvailabilityBitfields",
  $.tuple(codecs.$385),
  codecs.$644,
)

/** Candidates pending availability by `ParaId`. */
export const PendingAvailability = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaInclusion",
  "PendingAvailability",
  $.tuple(codecs.$98),
  codecs.$645,
)

/** The commitments of candidates pending availability, by `ParaId`. */
export const PendingAvailabilityCommitments = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaInclusion",
  "PendingAvailabilityCommitments",
  $.tuple(codecs.$98),
  codecs.$390,
)
