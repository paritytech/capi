import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  The set of account proxies. Maps the account which has delegated to the accounts
 *  which are being delegated to, together with the amount held on deposit.
 */
export const Proxies = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Proxy",
  "Proxies",
  $.tuple(codecs.$0),
  codecs.$574,
)

/** The announcements made by the proxy (key). */
export const Announcements = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Proxy",
  "Announcements",
  $.tuple(codecs.$0),
  codecs.$578,
)

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
export function proxy(value: Omit<types.pallet_proxy.pallet.Call.proxy, "type">) {
  return { type: "Proxy", value: { ...value, type: "proxy" } }
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
export function addProxy(value: Omit<types.pallet_proxy.pallet.Call.addProxy, "type">) {
  return { type: "Proxy", value: { ...value, type: "addProxy" } }
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
export function removeProxy(value: Omit<types.pallet_proxy.pallet.Call.removeProxy, "type">) {
  return { type: "Proxy", value: { ...value, type: "removeProxy" } }
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
export function removeProxies() {
  return { type: "Proxy", value: { type: "removeProxies" } }
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
export function anonymous(value: Omit<types.pallet_proxy.pallet.Call.anonymous, "type">) {
  return { type: "Proxy", value: { ...value, type: "anonymous" } }
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
export function killAnonymous(value: Omit<types.pallet_proxy.pallet.Call.killAnonymous, "type">) {
  return { type: "Proxy", value: { ...value, type: "killAnonymous" } }
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
export function announce(value: Omit<types.pallet_proxy.pallet.Call.announce, "type">) {
  return { type: "Proxy", value: { ...value, type: "announce" } }
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
) {
  return { type: "Proxy", value: { ...value, type: "removeAnnouncement" } }
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
) {
  return { type: "Proxy", value: { ...value, type: "rejectAnnouncement" } }
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
export function proxyAnnounced(value: Omit<types.pallet_proxy.pallet.Call.proxyAnnounced, "type">) {
  return { type: "Proxy", value: { ...value, type: "proxyAnnounced" } }
}

/**
 *  The base amount of currency needed to reserve for creating a proxy.
 *
 *  This is held for an additional storage item whose value size is
 *  `sizeof(Balance)` bytes and whose key size is `sizeof(AccountId)` bytes.
 */
export const ProxyDepositBase: types.u128 = codecs.$6.decode(
  C.hex.decode("0084b2952e0000000000000000000000" as C.Hex),
)

/**
 *  The amount of currency needed per proxy added.
 *
 *  This is held for adding 32 bytes plus an instance of `ProxyType` more into a
 *  pre-existing storage value. Thus, when configuring `ProxyDepositFactor` one should take
 *  into account `32 + proxy_type.encode().len()` bytes of data.
 */
export const ProxyDepositFactor: types.u128 = codecs.$6.decode(
  C.hex.decode("8066ab13000000000000000000000000" as C.Hex),
)

/** The maximum amount of proxies allowed for a single account. */
export const MaxProxies: types.u32 = codecs.$4.decode(C.hex.decode("20000000" as C.Hex))

/** The maximum amount of time-delayed announcements that are allowed to be pending. */
export const MaxPending: types.u32 = codecs.$4.decode(C.hex.decode("20000000" as C.Hex))

/**
 *  The base amount of currency needed to reserve for creating an announcement.
 *
 *  This is held when a new storage item holding a `Balance` is created (typically 16
 *  bytes).
 */
export const AnnouncementDepositBase: types.u128 = codecs.$6.decode(
  C.hex.decode("0084b2952e0000000000000000000000" as C.Hex),
)

/**
 *  The amount of currency needed per announcement made.
 *
 *  This is held for adding an `AccountId`, `Hash` and `BlockNumber` (typically 68 bytes)
 *  into a pre-existing storage value.
 */
export const AnnouncementDepositFactor: types.u128 = codecs.$6.decode(
  C.hex.decode("00cd5627000000000000000000000000" as C.Hex),
)
