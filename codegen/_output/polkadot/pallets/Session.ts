import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
/** Current index of the session. */
export const CurrentIndex = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Indices of disabled validators.
 *
 *  The vec is always kept sorted so that we can find whether a given validator is
 *  disabled using binary search. It gets cleared when `on_session_ending` returns
 *  a new set of identities.
 */
export const DisabledValidators = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$94,
}

/** The owner of a key. The key is the `KeyTypeId` + the encoded key. */
export const KeyOwner = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$513),
  value: _codec.$0,
}

/** The next session keys for a validator. */
export const NextKeys = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$212,
}

/**
 *  True if the underlying economic identities or weighting behind the validators
 *  has changed in the queued validator set.
 */
export const QueuedChanged = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$43,
}

/**
 *  The queued keys for the next session. When the next session begins, these keys
 *  will be used to determine the validator's session keys.
 */
export const QueuedKeys = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$511,
}

/** The current set of validators. */
export const Validators = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$206,
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
export function purge_keys(): t.polkadot_runtime.RuntimeCall {
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
  value: Omit<t.pallet_session.pallet.Call.set_keys, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Session", value: { ...value, type: "set_keys" } }
}
