import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** The lookup from index to account. */
export const Accounts = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Blake2_128Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$468,
}

/**
 * Assign an previously unassigned index.
 *
 * Payment: `Deposit` is reserved from the sender account.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * - `index`: the index to be claimed. This must not be in use.
 *
 * Emits `IndexAssigned` if successful.
 *
 * # <weight>
 * - `O(1)`.
 * - One storage mutation (codec `O(1)`).
 * - One reserve operation.
 * - One event.
 * -------------------
 * - DB Weight: 1 Read/Write (Accounts)
 * # </weight>
 */
export function claim(
  value: Omit<t.pallet_indices.pallet.Call.claim, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Indices", value: { ...value, type: "claim" } }
}

/**
 * Force an index to an account. This doesn't require a deposit. If the index is already
 * held, then any deposit is reimbursed to its current owner.
 *
 * The dispatch origin for this call must be _Root_.
 *
 * - `index`: the index to be (re-)assigned.
 * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
 * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
 *
 * Emits `IndexAssigned` if successful.
 *
 * # <weight>
 * - `O(1)`.
 * - One storage mutation (codec `O(1)`).
 * - Up to one reserve operation.
 * - One event.
 * -------------------
 * - DB Weight:
 *    - Reads: Indices Accounts, System Account (original owner)
 *    - Writes: Indices Accounts, System Account (original owner)
 * # </weight>
 */
export function force_transfer(
  value: Omit<t.pallet_indices.pallet.Call.force_transfer, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Indices", value: { ...value, type: "force_transfer" } }
}

/**
 * Free up an index owned by the sender.
 *
 * Payment: Any previous deposit placed for the index is unreserved in the sender account.
 *
 * The dispatch origin for this call must be _Signed_ and the sender must own the index.
 *
 * - `index`: the index to be freed. This must be owned by the sender.
 *
 * Emits `IndexFreed` if successful.
 *
 * # <weight>
 * - `O(1)`.
 * - One storage mutation (codec `O(1)`).
 * - One reserve operation.
 * - One event.
 * -------------------
 * - DB Weight: 1 Read/Write (Accounts)
 * # </weight>
 */
export function free(
  value: Omit<t.pallet_indices.pallet.Call.free, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Indices", value: { ...value, type: "free" } }
}

/**
 * Freeze an index so it will always point to the sender account. This consumes the
 * deposit.
 *
 * The dispatch origin for this call must be _Signed_ and the signing account must have a
 * non-frozen account `index`.
 *
 * - `index`: the index to be frozen in place.
 *
 * Emits `IndexFrozen` if successful.
 *
 * # <weight>
 * - `O(1)`.
 * - One storage mutation (codec `O(1)`).
 * - Up to one slash operation.
 * - One event.
 * -------------------
 * - DB Weight: 1 Read/Write (Accounts)
 * # </weight>
 */
export function freeze(
  value: Omit<t.pallet_indices.pallet.Call.freeze, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Indices", value: { ...value, type: "freeze" } }
}

/**
 * Assign an index already owned by the sender to another account. The balance reservation
 * is effectively transferred to the new account.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * - `index`: the index to be re-assigned. This must be owned by the sender.
 * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
 *
 * Emits `IndexAssigned` if successful.
 *
 * # <weight>
 * - `O(1)`.
 * - One storage mutation (codec `O(1)`).
 * - One transfer operation.
 * - One event.
 * -------------------
 * - DB Weight:
 *    - Reads: Indices Accounts, System Account (recipient)
 *    - Writes: Indices Accounts, System Account (recipient)
 * # </weight>
 */
export function transfer(
  value: Omit<t.pallet_indices.pallet.Call.transfer, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Indices", value: { ...value, type: "transfer" } }
}
