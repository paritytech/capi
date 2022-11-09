import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.pallet_proxy.pallet.Call> = _codec.$303

export const $error: $.Codec<t.pallet_proxy.pallet.Error> = _codec.$587

export const $event: $.Codec<t.pallet_proxy.pallet.Event> = _codec.$78

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_proxy.pallet.Call.proxy
  | t.pallet_proxy.pallet.Call.add_proxy
  | t.pallet_proxy.pallet.Call.remove_proxy
  | t.pallet_proxy.pallet.Call.remove_proxies
  | t.pallet_proxy.pallet.Call.create_pure
  | t.pallet_proxy.pallet.Call.kill_pure
  | t.pallet_proxy.pallet.Call.announce
  | t.pallet_proxy.pallet.Call.remove_announcement
  | t.pallet_proxy.pallet.Call.reject_announcement
  | t.pallet_proxy.pallet.Call.proxy_announced
export namespace Call {
  /**
   * Dispatch the given `call` from an account that the sender is authorised for through
   * `add_proxy`.
   *
   * Removes any corresponding announcement(s).
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
   * - `call`: The call to be made by the `real` account.
   */
  export interface proxy {
    type: "proxy"
    real: t.sp_runtime.multiaddress.MultiAddress
    force_proxy_type: t.polkadot_runtime.ProxyType | undefined
    call: t.polkadot_runtime.RuntimeCall
  }
  /**
   * Register a proxy account for the sender that is able to make calls on its behalf.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `proxy`: The account that the `caller` would like to make a proxy.
   * - `proxy_type`: The permissions allowed for this proxy account.
   * - `delay`: The announcement period required of the initial proxy. Will generally be
   * zero.
   */
  export interface add_proxy {
    type: "add_proxy"
    delegate: t.sp_runtime.multiaddress.MultiAddress
    proxy_type: t.polkadot_runtime.ProxyType
    delay: t.u32
  }
  /**
   * Unregister a proxy account for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `proxy`: The account that the `caller` would like to remove as a proxy.
   * - `proxy_type`: The permissions currently enabled for the removed proxy account.
   */
  export interface remove_proxy {
    type: "remove_proxy"
    delegate: t.sp_runtime.multiaddress.MultiAddress
    proxy_type: t.polkadot_runtime.ProxyType
    delay: t.u32
  }
  /**
   * Unregister all proxy accounts for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * WARNING: This may be called on accounts created by `pure`, however if done, then
   * the unreserved fees will be inaccessible. **All access to this account will be lost.**
   */
  export interface remove_proxies {
    type: "remove_proxies"
  }
  /**
   * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
   * initialize it with a proxy of `proxy_type` for `origin` sender.
   *
   * Requires a `Signed` origin.
   *
   * - `proxy_type`: The type of the proxy that the sender will be registered as over the
   * new account. This will almost always be the most permissive `ProxyType` possible to
   * allow for maximum flexibility.
   * - `index`: A disambiguation index, in case this is called multiple times in the same
   * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
   * want to use `0`.
   * - `delay`: The announcement period required of the initial proxy. Will generally be
   * zero.
   *
   * Fails with `Duplicate` if this has already been called in this transaction, from the
   * same sender, with the same parameters.
   *
   * Fails if there are insufficient funds to pay for deposit.
   */
  export interface create_pure {
    type: "create_pure"
    proxy_type: t.polkadot_runtime.ProxyType
    delay: t.u32
    index: t.u16
  }
  /**
   * Removes a previously spawned pure proxy.
   *
   * WARNING: **All access to this account will be lost.** Any funds held in it will be
   * inaccessible.
   *
   * Requires a `Signed` origin, and the sender account must have been created by a call to
   * `pure` with corresponding parameters.
   *
   * - `spawner`: The account that originally called `pure` to create this account.
   * - `index`: The disambiguation index originally passed to `pure`. Probably `0`.
   * - `proxy_type`: The proxy type originally passed to `pure`.
   * - `height`: The height of the chain when the call to `pure` was processed.
   * - `ext_index`: The extrinsic index in which the call to `pure` was processed.
   *
   * Fails with `NoPermission` in case the caller is not a previously created pure
   * account whose `pure` call has corresponding parameters.
   */
  export interface kill_pure {
    type: "kill_pure"
    spawner: t.sp_runtime.multiaddress.MultiAddress
    proxy_type: t.polkadot_runtime.ProxyType
    index: t.u16
    height: t.Compact<t.u32>
    ext_index: t.Compact<t.u32>
  }
  /**
   * Publish the hash of a proxy-call that will be made in the future.
   *
   * This must be called some number of blocks before the corresponding `proxy` is attempted
   * if the delay associated with the proxy relationship is greater than zero.
   *
   * No more than `MaxPending` announcements may be made at any one time.
   *
   * This will take a deposit of `AnnouncementDepositFactor` as well as
   * `AnnouncementDepositBase` if there are no other pending announcements.
   *
   * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `call_hash`: The hash of the call to be made by the `real` account.
   */
  export interface announce {
    type: "announce"
    real: t.sp_runtime.multiaddress.MultiAddress
    call_hash: t.primitive_types.H256
  }
  /**
   * Remove a given announcement.
   *
   * May be called by a proxy account to remove a call they previously announced and return
   * the deposit.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `call_hash`: The hash of the call to be made by the `real` account.
   */
  export interface remove_announcement {
    type: "remove_announcement"
    real: t.sp_runtime.multiaddress.MultiAddress
    call_hash: t.primitive_types.H256
  }
  /**
   * Remove the given announcement of a delegate.
   *
   * May be called by a target (proxied) account to remove a call that one of their delegates
   * (`delegate`) has announced they want to execute. The deposit is returned.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `delegate`: The account that previously announced the call.
   * - `call_hash`: The hash of the call to be made.
   */
  export interface reject_announcement {
    type: "reject_announcement"
    delegate: t.sp_runtime.multiaddress.MultiAddress
    call_hash: t.primitive_types.H256
  }
  /**
   * Dispatch the given `call` from an account that the sender is authorized for through
   * `add_proxy`.
   *
   * Removes any corresponding announcement(s).
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
   * - `call`: The call to be made by the `real` account.
   */
  export interface proxy_announced {
    type: "proxy_announced"
    delegate: t.sp_runtime.multiaddress.MultiAddress
    real: t.sp_runtime.multiaddress.MultiAddress
    force_proxy_type: t.polkadot_runtime.ProxyType | undefined
    call: t.polkadot_runtime.RuntimeCall
  }
  /**
   * Dispatch the given `call` from an account that the sender is authorised for through
   * `add_proxy`.
   *
   * Removes any corresponding announcement(s).
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
   * - `call`: The call to be made by the `real` account.
   */
  export function proxy(
    value: Omit<t.pallet_proxy.pallet.Call.proxy, "type">,
  ): t.pallet_proxy.pallet.Call.proxy {
    return { type: "proxy", ...value }
  }
  /**
   * Register a proxy account for the sender that is able to make calls on its behalf.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `proxy`: The account that the `caller` would like to make a proxy.
   * - `proxy_type`: The permissions allowed for this proxy account.
   * - `delay`: The announcement period required of the initial proxy. Will generally be
   * zero.
   */
  export function add_proxy(
    value: Omit<t.pallet_proxy.pallet.Call.add_proxy, "type">,
  ): t.pallet_proxy.pallet.Call.add_proxy {
    return { type: "add_proxy", ...value }
  }
  /**
   * Unregister a proxy account for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `proxy`: The account that the `caller` would like to remove as a proxy.
   * - `proxy_type`: The permissions currently enabled for the removed proxy account.
   */
  export function remove_proxy(
    value: Omit<t.pallet_proxy.pallet.Call.remove_proxy, "type">,
  ): t.pallet_proxy.pallet.Call.remove_proxy {
    return { type: "remove_proxy", ...value }
  }
  /**
   * Unregister all proxy accounts for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * WARNING: This may be called on accounts created by `pure`, however if done, then
   * the unreserved fees will be inaccessible. **All access to this account will be lost.**
   */
  export function remove_proxies(): t.pallet_proxy.pallet.Call.remove_proxies {
    return { type: "remove_proxies" }
  }
  /**
   * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
   * initialize it with a proxy of `proxy_type` for `origin` sender.
   *
   * Requires a `Signed` origin.
   *
   * - `proxy_type`: The type of the proxy that the sender will be registered as over the
   * new account. This will almost always be the most permissive `ProxyType` possible to
   * allow for maximum flexibility.
   * - `index`: A disambiguation index, in case this is called multiple times in the same
   * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
   * want to use `0`.
   * - `delay`: The announcement period required of the initial proxy. Will generally be
   * zero.
   *
   * Fails with `Duplicate` if this has already been called in this transaction, from the
   * same sender, with the same parameters.
   *
   * Fails if there are insufficient funds to pay for deposit.
   */
  export function create_pure(
    value: Omit<t.pallet_proxy.pallet.Call.create_pure, "type">,
  ): t.pallet_proxy.pallet.Call.create_pure {
    return { type: "create_pure", ...value }
  }
  /**
   * Removes a previously spawned pure proxy.
   *
   * WARNING: **All access to this account will be lost.** Any funds held in it will be
   * inaccessible.
   *
   * Requires a `Signed` origin, and the sender account must have been created by a call to
   * `pure` with corresponding parameters.
   *
   * - `spawner`: The account that originally called `pure` to create this account.
   * - `index`: The disambiguation index originally passed to `pure`. Probably `0`.
   * - `proxy_type`: The proxy type originally passed to `pure`.
   * - `height`: The height of the chain when the call to `pure` was processed.
   * - `ext_index`: The extrinsic index in which the call to `pure` was processed.
   *
   * Fails with `NoPermission` in case the caller is not a previously created pure
   * account whose `pure` call has corresponding parameters.
   */
  export function kill_pure(
    value: Omit<t.pallet_proxy.pallet.Call.kill_pure, "type">,
  ): t.pallet_proxy.pallet.Call.kill_pure {
    return { type: "kill_pure", ...value }
  }
  /**
   * Publish the hash of a proxy-call that will be made in the future.
   *
   * This must be called some number of blocks before the corresponding `proxy` is attempted
   * if the delay associated with the proxy relationship is greater than zero.
   *
   * No more than `MaxPending` announcements may be made at any one time.
   *
   * This will take a deposit of `AnnouncementDepositFactor` as well as
   * `AnnouncementDepositBase` if there are no other pending announcements.
   *
   * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `call_hash`: The hash of the call to be made by the `real` account.
   */
  export function announce(
    value: Omit<t.pallet_proxy.pallet.Call.announce, "type">,
  ): t.pallet_proxy.pallet.Call.announce {
    return { type: "announce", ...value }
  }
  /**
   * Remove a given announcement.
   *
   * May be called by a proxy account to remove a call they previously announced and return
   * the deposit.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `call_hash`: The hash of the call to be made by the `real` account.
   */
  export function remove_announcement(
    value: Omit<t.pallet_proxy.pallet.Call.remove_announcement, "type">,
  ): t.pallet_proxy.pallet.Call.remove_announcement {
    return { type: "remove_announcement", ...value }
  }
  /**
   * Remove the given announcement of a delegate.
   *
   * May be called by a target (proxied) account to remove a call that one of their delegates
   * (`delegate`) has announced they want to execute. The deposit is returned.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `delegate`: The account that previously announced the call.
   * - `call_hash`: The hash of the call to be made.
   */
  export function reject_announcement(
    value: Omit<t.pallet_proxy.pallet.Call.reject_announcement, "type">,
  ): t.pallet_proxy.pallet.Call.reject_announcement {
    return { type: "reject_announcement", ...value }
  }
  /**
   * Dispatch the given `call` from an account that the sender is authorized for through
   * `add_proxy`.
   *
   * Removes any corresponding announcement(s).
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `real`: The account that the proxy will make a call on behalf of.
   * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
   * - `call`: The call to be made by the `real` account.
   */
  export function proxy_announced(
    value: Omit<t.pallet_proxy.pallet.Call.proxy_announced, "type">,
  ): t.pallet_proxy.pallet.Call.proxy_announced {
    return { type: "proxy_announced", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "TooMany"
  | "NotFound"
  | "NotProxy"
  | "Unproxyable"
  | "Duplicate"
  | "NoPermission"
  | "Unannounced"
  | "NoSelfProxy"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_proxy.pallet.Event.ProxyExecuted
  | t.pallet_proxy.pallet.Event.PureCreated
  | t.pallet_proxy.pallet.Event.Announced
  | t.pallet_proxy.pallet.Event.ProxyAdded
  | t.pallet_proxy.pallet.Event.ProxyRemoved
export namespace Event {
  /** A proxy was executed correctly, with the given. */
  export interface ProxyExecuted {
    type: "ProxyExecuted"
    result: null | ChainError<t.sp_runtime.DispatchError>
  }
  /**
   * A pure account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  export interface PureCreated {
    type: "PureCreated"
    pure: t.sp_core.crypto.AccountId32
    who: t.sp_core.crypto.AccountId32
    proxy_type: t.polkadot_runtime.ProxyType
    disambiguation_index: t.u16
  }
  /** An announcement was placed to make a call in the future. */
  export interface Announced {
    type: "Announced"
    real: t.sp_core.crypto.AccountId32
    proxy: t.sp_core.crypto.AccountId32
    call_hash: t.primitive_types.H256
  }
  /** A proxy was added. */
  export interface ProxyAdded {
    type: "ProxyAdded"
    delegator: t.sp_core.crypto.AccountId32
    delegatee: t.sp_core.crypto.AccountId32
    proxy_type: t.polkadot_runtime.ProxyType
    delay: t.u32
  }
  /** A proxy was removed. */
  export interface ProxyRemoved {
    type: "ProxyRemoved"
    delegator: t.sp_core.crypto.AccountId32
    delegatee: t.sp_core.crypto.AccountId32
    proxy_type: t.polkadot_runtime.ProxyType
    delay: t.u32
  }
  /** A proxy was executed correctly, with the given. */
  export function ProxyExecuted(
    value: Omit<t.pallet_proxy.pallet.Event.ProxyExecuted, "type">,
  ): t.pallet_proxy.pallet.Event.ProxyExecuted {
    return { type: "ProxyExecuted", ...value }
  }
  /**
   * A pure account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  export function PureCreated(
    value: Omit<t.pallet_proxy.pallet.Event.PureCreated, "type">,
  ): t.pallet_proxy.pallet.Event.PureCreated {
    return { type: "PureCreated", ...value }
  }
  /** An announcement was placed to make a call in the future. */
  export function Announced(
    value: Omit<t.pallet_proxy.pallet.Event.Announced, "type">,
  ): t.pallet_proxy.pallet.Event.Announced {
    return { type: "Announced", ...value }
  }
  /** A proxy was added. */
  export function ProxyAdded(
    value: Omit<t.pallet_proxy.pallet.Event.ProxyAdded, "type">,
  ): t.pallet_proxy.pallet.Event.ProxyAdded {
    return { type: "ProxyAdded", ...value }
  }
  /** A proxy was removed. */
  export function ProxyRemoved(
    value: Omit<t.pallet_proxy.pallet.Event.ProxyRemoved, "type">,
  ): t.pallet_proxy.pallet.Event.ProxyRemoved {
    return { type: "ProxyRemoved", ...value }
  }
}
