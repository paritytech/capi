import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Information regarding the vesting of a given account. */
export const Vesting = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Vesting",
  "Vesting",
  $.tuple(codecs.$0),
  codecs.$558,
)

/**
 *  Storage version of the pallet.
 *
 *  New networks start with latest version, as determined by the genesis build.
 */
export const StorageVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Vesting",
  "StorageVersion",
  $.tuple(),
  codecs.$560,
)

/**
 * Unlock any vested funds of the sender account.
 *
 * The dispatch origin for this call must be _Signed_ and the sender must have funds still
 * locked under this pallet.
 *
 * Emits either `VestingCompleted` or `VestingUpdated`.
 *
 * # <weight>
 * - `O(1)`.
 * - DbWeight: 2 Reads, 2 Writes
 *     - Reads: Vesting Storage, Balances Locks, [Sender Account]
 *     - Writes: Vesting Storage, Balances Locks, [Sender Account]
 * # </weight>
 */
export function vest() {
  return { type: "Vesting", value: { type: "vest" } }
}

/**
 * Unlock any vested funds of a `target` account.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * - `target`: The account whose vested funds should be unlocked. Must have funds still
 * locked under this pallet.
 *
 * Emits either `VestingCompleted` or `VestingUpdated`.
 *
 * # <weight>
 * - `O(1)`.
 * - DbWeight: 3 Reads, 3 Writes
 *     - Reads: Vesting Storage, Balances Locks, Target Account
 *     - Writes: Vesting Storage, Balances Locks, Target Account
 * # </weight>
 */
export function vestOther(value: Omit<types.pallet_vesting.pallet.Call.vestOther, "type">) {
  return { type: "Vesting", value: { ...value, type: "vestOther" } }
}

/**
 * Create a vested transfer.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * - `target`: The account receiving the vested funds.
 * - `schedule`: The vesting schedule attached to the transfer.
 *
 * Emits `VestingCreated`.
 *
 * NOTE: This will unlock all schedules through the current block.
 *
 * # <weight>
 * - `O(1)`.
 * - DbWeight: 3 Reads, 3 Writes
 *     - Reads: Vesting Storage, Balances Locks, Target Account, [Sender Account]
 *     - Writes: Vesting Storage, Balances Locks, Target Account, [Sender Account]
 * # </weight>
 */
export function vestedTransfer(
  value: Omit<types.pallet_vesting.pallet.Call.vestedTransfer, "type">,
) {
  return { type: "Vesting", value: { ...value, type: "vestedTransfer" } }
}

/**
 * Force a vested transfer.
 *
 * The dispatch origin for this call must be _Root_.
 *
 * - `source`: The account whose funds should be transferred.
 * - `target`: The account that should be transferred the vested funds.
 * - `schedule`: The vesting schedule attached to the transfer.
 *
 * Emits `VestingCreated`.
 *
 * NOTE: This will unlock all schedules through the current block.
 *
 * # <weight>
 * - `O(1)`.
 * - DbWeight: 4 Reads, 4 Writes
 *     - Reads: Vesting Storage, Balances Locks, Target Account, Source Account
 *     - Writes: Vesting Storage, Balances Locks, Target Account, Source Account
 * # </weight>
 */
export function forceVestedTransfer(
  value: Omit<types.pallet_vesting.pallet.Call.forceVestedTransfer, "type">,
) {
  return { type: "Vesting", value: { ...value, type: "forceVestedTransfer" } }
}

/**
 * Merge two vesting schedules together, creating a new vesting schedule that unlocks over
 * the highest possible start and end blocks. If both schedules have already started the
 * current block will be used as the schedule start; with the caveat that if one schedule
 * is finished by the current block, the other will be treated as the new merged schedule,
 * unmodified.
 *
 * NOTE: If `schedule1_index == schedule2_index` this is a no-op.
 * NOTE: This will unlock all schedules through the current block prior to merging.
 * NOTE: If both schedules have ended by the current block, no new schedule will be created
 * and both will be removed.
 *
 * Merged schedule attributes:
 * - `starting_block`: `MAX(schedule1.starting_block, scheduled2.starting_block,
 *   current_block)`.
 * - `ending_block`: `MAX(schedule1.ending_block, schedule2.ending_block)`.
 * - `locked`: `schedule1.locked_at(current_block) + schedule2.locked_at(current_block)`.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * - `schedule1_index`: index of the first schedule to merge.
 * - `schedule2_index`: index of the second schedule to merge.
 */
export function mergeSchedules(
  value: Omit<types.pallet_vesting.pallet.Call.mergeSchedules, "type">,
) {
  return { type: "Vesting", value: { ...value, type: "mergeSchedules" } }
}

/** The minimum amount transferred to call `vested_transfer`. */
export const MinVestedTransfer: types.u128 = codecs.$6.decode(
  C.hex.decode("00e40b54020000000000000000000000" as C.Hex),
)

export const MaxVestingSchedules: types.u32 = codecs.$4.decode(C.hex.decode("1c000000" as C.Hex))
