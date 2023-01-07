import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The current session index. */
export const CurrentSessionIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParasShared",
  "CurrentSessionIndex",
  $.tuple(),
  codecs.$4,
)

/**
 *  All the validators actively participating in parachain consensus.
 *  Indices are into the broader validator set.
 */
export const ActiveValidatorIndices = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParasShared",
  "ActiveValidatorIndices",
  $.tuple(),
  codecs.$634,
)

/**
 *  The parachain attestation keys of the validators actively participating in parachain consensus.
 *  This should be the same length as `ActiveValidatorIndices`.
 */
export const ActiveValidatorKeys = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParasShared",
  "ActiveValidatorKeys",
  $.tuple(),
  codecs.$635,
)
