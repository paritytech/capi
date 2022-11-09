import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
/**
 *  All the validators actively participating in parachain consensus.
 *  Indices are into the broader validator set.
 */
export const ActiveValidatorIndices = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$642,
}

/**
 *  The parachain attestation keys of the validators actively participating in parachain consensus.
 *  This should be the same length as `ActiveValidatorIndices`.
 */
export const ActiveValidatorKeys = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$643,
}

/** The current session index. */
export const CurrentSessionIndex = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}
