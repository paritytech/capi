import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The current set of validators. */
export const Validators = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "Validators",
  $.tuple(),
  codecs.$62,
)

/** Current index of the session. */
export const CurrentIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "CurrentIndex",
  $.tuple(),
  codecs.$4,
)

/**
 *  True if the underlying economic identities or weighting behind the validators
 *  has changed in the queued validator set.
 */
export const QueuedChanged = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "QueuedChanged",
  $.tuple(),
  codecs.$43,
)

/**
 *  The queued keys for the next session. When the next session begins, these keys
 *  will be used to determine the validator's session keys.
 */
export const QueuedKeys = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "QueuedKeys",
  $.tuple(),
  codecs.$507,
)

/**
 *  Indices of disabled validators.
 *
 *  The vec is always kept sorted so that we can find whether a given validator is
 *  disabled using binary search. It gets cleared when `on_session_ending` returns
 *  a new set of identities.
 */
export const DisabledValidators = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "DisabledValidators",
  $.tuple(),
  codecs.$206,
)

/** The next session keys for a validator. */
export const NextKeys = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Session",
  "NextKeys",
  $.tuple(codecs.$0),
  codecs.$212,
)

/** The owner of a key. The key is the `KeyTypeId` + the encoded key. */
export const KeyOwner = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Session",
  "KeyOwner",
  $.tuple(codecs.$509),
  codecs.$0,
)

/**
 * Sets the session key(s) of the function caller to `keys`.
 * Allows an account to set its session key prior to becoming a validator.
 * This doesn't take effect until the next session.
 *
 * The dispatch origin of this function must be signed.
 *
 * # <weight>
 * - Complexity: `O(1)`. Actual cost depends on the number of length of
 *   `T::Keys::key_ids()` which is fixed.
 * - DbReads: `origin account`, `T::ValidatorIdOf`, `NextKeys`
 * - DbWrites: `origin account`, `NextKeys`
 * - DbReads per key id: `KeyOwner`
 * - DbWrites per key id: `KeyOwner`
 * # </weight>
 */
export function setKeys(value: Omit<types.pallet_session.pallet.Call.setKeys, "type">) {
  return { type: "Session", value: { ...value, type: "setKeys" } }
}

/**
 * Removes any session key(s) of the function caller.
 *
 * This doesn't take effect until the next session.
 *
 * The dispatch origin of this function must be Signed and the account must be either be
 * convertible to a validator ID using the chain's typical addressing system (this usually
 * means being a controller account) or directly convertible into a validator ID (which
 * usually means being a stash account).
 *
 * # <weight>
 * - Complexity: `O(1)` in number of key types. Actual cost depends on the number of length
 *   of `T::Keys::key_ids()` which is fixed.
 * - DbReads: `T::ValidatorIdOf`, `NextKeys`, `origin account`
 * - DbWrites: `NextKeys`, `origin account`
 * - DbWrites per key id: `KeyOwner`
 * # </weight>
 */
export function purgeKeys() {
  return { type: "Session", value: { type: "purgeKeys" } }
}
