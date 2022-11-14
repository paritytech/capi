import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Current index of the session. */
export const CurrentIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "CurrentIndex",
  $.tuple(),
  _codec.$4,
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
  _codec.$94,
)

/** The owner of a key. The key is the `KeyTypeId` + the encoded key. */
export const KeyOwner = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Session",
  "KeyOwner",
  $.tuple(_codec.$513),
  _codec.$0,
)

/** The next session keys for a validator. */
export const NextKeys = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Session",
  "NextKeys",
  $.tuple(_codec.$0),
  _codec.$212,
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
  _codec.$43,
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
  _codec.$511,
)

/** The current set of validators. */
export const Validators = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Session",
  "Validators",
  $.tuple(),
  _codec.$206,
)

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
export function purge_keys(): types.polkadot_runtime.RuntimeCall {
  return { type: "Session", value: { type: "purge_keys" } }
}

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
export function set_keys(
  value: Omit<types.pallet_session.pallet.Call.set_keys, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Session", value: { ...value, type: "set_keys" } }
}
