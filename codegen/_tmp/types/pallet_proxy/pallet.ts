import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_proxy.pallet.Call> = codecs.$302
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_proxy.pallet.Call.proxy
  | types.pallet_proxy.pallet.Call.addProxy
  | types.pallet_proxy.pallet.Call.removeProxy
  | types.pallet_proxy.pallet.Call.removeProxies
  | types.pallet_proxy.pallet.Call.anonymous
  | types.pallet_proxy.pallet.Call.killAnonymous
  | types.pallet_proxy.pallet.Call.announce
  | types.pallet_proxy.pallet.Call.removeAnnouncement
  | types.pallet_proxy.pallet.Call.rejectAnnouncement
  | types.pallet_proxy.pallet.Call.proxyAnnounced
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
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export interface proxy {
    type: "proxy"
    real: types.sp_runtime.multiaddress.MultiAddress
    forceProxyType: types.polkadot_runtime.ProxyType | undefined
    call: types.polkadot_runtime.Call
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
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export interface addProxy {
    type: "addProxy"
    delegate: types.sp_runtime.multiaddress.MultiAddress
    proxyType: types.polkadot_runtime.ProxyType
    delay: types.u32
  }
  /**
   * Unregister a proxy account for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `proxy`: The account that the `caller` would like to remove as a proxy.
   * - `proxy_type`: The permissions currently enabled for the removed proxy account.
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export interface removeProxy {
    type: "removeProxy"
    delegate: types.sp_runtime.multiaddress.MultiAddress
    proxyType: types.polkadot_runtime.ProxyType
    delay: types.u32
  }
  /**
   * Unregister all proxy accounts for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * WARNING: This may be called on accounts created by `anonymous`, however if done, then
   * the unreserved fees will be inaccessible. **All access to this account will be lost.**
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export interface removeProxies {
    type: "removeProxies"
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
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   * TODO: Might be over counting 1 read
   */
  export interface anonymous {
    type: "anonymous"
    proxyType: types.polkadot_runtime.ProxyType
    delay: types.u32
    index: types.u16
  }
  /**
   * Removes a previously spawned anonymous proxy.
   *
   * WARNING: **All access to this account will be lost.** Any funds held in it will be
   * inaccessible.
   *
   * Requires a `Signed` origin, and the sender account must have been created by a call to
   * `anonymous` with corresponding parameters.
   *
   * - `spawner`: The account that originally called `anonymous` to create this account.
   * - `index`: The disambiguation index originally passed to `anonymous`. Probably `0`.
   * - `proxy_type`: The proxy type originally passed to `anonymous`.
   * - `height`: The height of the chain when the call to `anonymous` was processed.
   * - `ext_index`: The extrinsic index in which the call to `anonymous` was processed.
   *
   * Fails with `NoPermission` in case the caller is not a previously created anonymous
   * account whose `anonymous` call has corresponding parameters.
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export interface killAnonymous {
    type: "killAnonymous"
    spawner: types.sp_runtime.multiaddress.MultiAddress
    proxyType: types.polkadot_runtime.ProxyType
    index: types.u16
    height: types.Compact<types.u32>
    extIndex: types.Compact<types.u32>
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export interface announce {
    type: "announce"
    real: types.sp_runtime.multiaddress.MultiAddress
    callHash: types.primitive_types.H256
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export interface removeAnnouncement {
    type: "removeAnnouncement"
    real: types.sp_runtime.multiaddress.MultiAddress
    callHash: types.primitive_types.H256
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export interface rejectAnnouncement {
    type: "rejectAnnouncement"
    delegate: types.sp_runtime.multiaddress.MultiAddress
    callHash: types.primitive_types.H256
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export interface proxyAnnounced {
    type: "proxyAnnounced"
    delegate: types.sp_runtime.multiaddress.MultiAddress
    real: types.sp_runtime.multiaddress.MultiAddress
    forceProxyType: types.polkadot_runtime.ProxyType | undefined
    call: types.polkadot_runtime.Call
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
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export function proxy(
    value: Omit<types.pallet_proxy.pallet.Call.proxy, "type">,
  ): types.pallet_proxy.pallet.Call.proxy {
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
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export function addProxy(
    value: Omit<types.pallet_proxy.pallet.Call.addProxy, "type">,
  ): types.pallet_proxy.pallet.Call.addProxy {
    return { type: "addProxy", ...value }
  }
  /**
   * Unregister a proxy account for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * Parameters:
   * - `proxy`: The account that the `caller` would like to remove as a proxy.
   * - `proxy_type`: The permissions currently enabled for the removed proxy account.
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export function removeProxy(
    value: Omit<types.pallet_proxy.pallet.Call.removeProxy, "type">,
  ): types.pallet_proxy.pallet.Call.removeProxy {
    return { type: "removeProxy", ...value }
  }
  /**
   * Unregister all proxy accounts for the sender.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * WARNING: This may be called on accounts created by `anonymous`, however if done, then
   * the unreserved fees will be inaccessible. **All access to this account will be lost.**
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export function removeProxies(): types.pallet_proxy.pallet.Call.removeProxies {
    return { type: "removeProxies" }
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
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   * TODO: Might be over counting 1 read
   */
  export function anonymous(
    value: Omit<types.pallet_proxy.pallet.Call.anonymous, "type">,
  ): types.pallet_proxy.pallet.Call.anonymous {
    return { type: "anonymous", ...value }
  }
  /**
   * Removes a previously spawned anonymous proxy.
   *
   * WARNING: **All access to this account will be lost.** Any funds held in it will be
   * inaccessible.
   *
   * Requires a `Signed` origin, and the sender account must have been created by a call to
   * `anonymous` with corresponding parameters.
   *
   * - `spawner`: The account that originally called `anonymous` to create this account.
   * - `index`: The disambiguation index originally passed to `anonymous`. Probably `0`.
   * - `proxy_type`: The proxy type originally passed to `anonymous`.
   * - `height`: The height of the chain when the call to `anonymous` was processed.
   * - `ext_index`: The extrinsic index in which the call to `anonymous` was processed.
   *
   * Fails with `NoPermission` in case the caller is not a previously created anonymous
   * account whose `anonymous` call has corresponding parameters.
   *
   * # <weight>
   * Weight is a function of the number of proxies the user has (P).
   * # </weight>
   */
  export function killAnonymous(
    value: Omit<types.pallet_proxy.pallet.Call.killAnonymous, "type">,
  ): types.pallet_proxy.pallet.Call.killAnonymous {
    return { type: "killAnonymous", ...value }
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export function announce(
    value: Omit<types.pallet_proxy.pallet.Call.announce, "type">,
  ): types.pallet_proxy.pallet.Call.announce {
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export function removeAnnouncement(
    value: Omit<types.pallet_proxy.pallet.Call.removeAnnouncement, "type">,
  ): types.pallet_proxy.pallet.Call.removeAnnouncement {
    return { type: "removeAnnouncement", ...value }
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export function rejectAnnouncement(
    value: Omit<types.pallet_proxy.pallet.Call.rejectAnnouncement, "type">,
  ): types.pallet_proxy.pallet.Call.rejectAnnouncement {
    return { type: "rejectAnnouncement", ...value }
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
   *
   * # <weight>
   * Weight is a function of:
   * - A: the number of announcements made.
   * - P: the number of proxies the user has.
   * # </weight>
   */
  export function proxyAnnounced(
    value: Omit<types.pallet_proxy.pallet.Call.proxyAnnounced, "type">,
  ): types.pallet_proxy.pallet.Call.proxyAnnounced {
    return { type: "proxyAnnounced", ...value }
  }
}

export const $error: $.Codec<types.pallet_proxy.pallet.Error> = codecs.$582
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

export const $event: $.Codec<types.pallet_proxy.pallet.Event> = codecs.$79
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_proxy.pallet.Event.ProxyExecuted
  | types.pallet_proxy.pallet.Event.AnonymousCreated
  | types.pallet_proxy.pallet.Event.Announced
  | types.pallet_proxy.pallet.Event.ProxyAdded
  | types.pallet_proxy.pallet.Event.ProxyRemoved
export namespace Event {
  /** A proxy was executed correctly, with the given. */
  export interface ProxyExecuted {
    type: "ProxyExecuted"
    result: null | C.ChainError<types.sp_runtime.DispatchError>
  }
  /**
   * Anonymous account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  export interface AnonymousCreated {
    type: "AnonymousCreated"
    anonymous: types.sp_core.crypto.AccountId32
    who: types.sp_core.crypto.AccountId32
    proxyType: types.polkadot_runtime.ProxyType
    disambiguationIndex: types.u16
  }
  /** An announcement was placed to make a call in the future. */
  export interface Announced {
    type: "Announced"
    real: types.sp_core.crypto.AccountId32
    proxy: types.sp_core.crypto.AccountId32
    callHash: types.primitive_types.H256
  }
  /** A proxy was added. */
  export interface ProxyAdded {
    type: "ProxyAdded"
    delegator: types.sp_core.crypto.AccountId32
    delegatee: types.sp_core.crypto.AccountId32
    proxyType: types.polkadot_runtime.ProxyType
    delay: types.u32
  }
  /** A proxy was removed. */
  export interface ProxyRemoved {
    type: "ProxyRemoved"
    delegator: types.sp_core.crypto.AccountId32
    delegatee: types.sp_core.crypto.AccountId32
    proxyType: types.polkadot_runtime.ProxyType
    delay: types.u32
  }
  /** A proxy was executed correctly, with the given. */
  export function ProxyExecuted(
    value: Omit<types.pallet_proxy.pallet.Event.ProxyExecuted, "type">,
  ): types.pallet_proxy.pallet.Event.ProxyExecuted {
    return { type: "ProxyExecuted", ...value }
  }
  /**
   * Anonymous account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  export function AnonymousCreated(
    value: Omit<types.pallet_proxy.pallet.Event.AnonymousCreated, "type">,
  ): types.pallet_proxy.pallet.Event.AnonymousCreated {
    return { type: "AnonymousCreated", ...value }
  }
  /** An announcement was placed to make a call in the future. */
  export function Announced(
    value: Omit<types.pallet_proxy.pallet.Event.Announced, "type">,
  ): types.pallet_proxy.pallet.Event.Announced {
    return { type: "Announced", ...value }
  }
  /** A proxy was added. */
  export function ProxyAdded(
    value: Omit<types.pallet_proxy.pallet.Event.ProxyAdded, "type">,
  ): types.pallet_proxy.pallet.Event.ProxyAdded {
    return { type: "ProxyAdded", ...value }
  }
  /** A proxy was removed. */
  export function ProxyRemoved(
    value: Omit<types.pallet_proxy.pallet.Event.ProxyRemoved, "type">,
  ): types.pallet_proxy.pallet.Event.ProxyRemoved {
    return { type: "ProxyRemoved", ...value }
  }
}
