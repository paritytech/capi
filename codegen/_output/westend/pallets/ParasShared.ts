import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"

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
  _codec.$642,
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
  _codec.$643,
)

/** The current session index. */
export const CurrentSessionIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParasShared",
  "CurrentSessionIndex",
  $.tuple(),
  _codec.$4,
)
