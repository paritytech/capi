import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** The announcements made by the proxy (key). */
export const Announcements = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$583,
}

/**
 *  The set of account proxies. Maps the account which has delegated to the accounts
 *  which are being delegated to, together with the amount held on deposit.
 */
export const Proxies = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$579,
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
  value: Omit<t.types.pallet_proxy.pallet.Call.add_proxy, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "add_proxy" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.announce, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "announce" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.create_pure, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "create_pure" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.kill_pure, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "kill_pure" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.proxy, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "proxy" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.proxy_announced, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "proxy_announced" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.reject_announcement, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "reject_announcement" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.remove_announcement, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "remove_announcement" } }
}

/**
 * Unregister all proxy accounts for the sender.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * WARNING: This may be called on accounts created by `pure`, however if done, then
 * the unreserved fees will be inaccessible. **All access to this account will be lost.**
 */
export function remove_proxies(): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { type: "remove_proxies" } }
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
  value: Omit<t.types.pallet_proxy.pallet.Call.remove_proxy, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Proxy", value: { ...value, type: "remove_proxy" } }
}
