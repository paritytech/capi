import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_session.pallet.Call> = codecs.$211
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_session.pallet.Call.setKeys
  | types.pallet_session.pallet.Call.purgeKeys
export namespace Call {
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
  export interface setKeys {
    type: "setKeys"
    keys: types.polkadot_runtime.SessionKeys
    proof: Uint8Array
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
  export interface purgeKeys {
    type: "purgeKeys"
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
  export function setKeys(
    value: Omit<types.pallet_session.pallet.Call.setKeys, "type">,
  ): types.pallet_session.pallet.Call.setKeys {
    return { type: "setKeys", ...value }
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
  export function purgeKeys(): types.pallet_session.pallet.Call.purgeKeys {
    return { type: "purgeKeys" }
  }
}

export const $error: $.Codec<types.pallet_session.pallet.Error> = codecs.$511
/** Error for the session pallet. */

export type Error =
  | "InvalidProof"
  | "NoAssociatedValidatorId"
  | "DuplicatedKey"
  | "NoKeys"
  | "NoAccount"

export const $event: $.Codec<types.pallet_session.pallet.Event> = codecs.$46
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event = types.pallet_session.pallet.Event.NewSession
export namespace Event {
  /**
   * New session has happened. Note that the argument is the session index, not the
   * block number as the type might suggest.
   */
  export interface NewSession {
    type: "NewSession"
    sessionIndex: types.u32
  }
  /**
   * New session has happened. Note that the argument is the session index, not the
   * block number as the type might suggest.
   */
  export function NewSession(
    value: Omit<types.pallet_session.pallet.Event.NewSession, "type">,
  ): types.pallet_session.pallet.Event.NewSession {
    return { type: "NewSession", ...value }
  }
}
