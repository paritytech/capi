import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_vesting.pallet.Call> = _codec.$252

export const $error: $.Codec<t.types.pallet_vesting.pallet.Error> = _codec.$566

export const $event: $.Codec<t.types.pallet_vesting.pallet.Event> = _codec.$75

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.pallet_vesting.pallet.Call.vest
  | t.types.pallet_vesting.pallet.Call.vest_other
  | t.types.pallet_vesting.pallet.Call.vested_transfer
  | t.types.pallet_vesting.pallet.Call.force_vested_transfer
  | t.types.pallet_vesting.pallet.Call.merge_schedules
export namespace Call {
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
  export interface vest {
    type: "vest"
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
  export interface vest_other {
    type: "vest_other"
    target: t.types.sp_runtime.multiaddress.MultiAddress
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
  export interface vested_transfer {
    type: "vested_transfer"
    target: t.types.sp_runtime.multiaddress.MultiAddress
    schedule: t.types.pallet_vesting.vesting_info.VestingInfo
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
  export interface force_vested_transfer {
    type: "force_vested_transfer"
    source: t.types.sp_runtime.multiaddress.MultiAddress
    target: t.types.sp_runtime.multiaddress.MultiAddress
    schedule: t.types.pallet_vesting.vesting_info.VestingInfo
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
  export interface merge_schedules {
    type: "merge_schedules"
    schedule1_index: t.types.u32
    schedule2_index: t.types.u32
  }
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
  export function vest(): t.types.pallet_vesting.pallet.Call.vest {
    return { type: "vest" }
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
  export function vest_other(
    value: Omit<t.types.pallet_vesting.pallet.Call.vest_other, "type">,
  ): t.types.pallet_vesting.pallet.Call.vest_other {
    return { type: "vest_other", ...value }
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
  export function vested_transfer(
    value: Omit<t.types.pallet_vesting.pallet.Call.vested_transfer, "type">,
  ): t.types.pallet_vesting.pallet.Call.vested_transfer {
    return { type: "vested_transfer", ...value }
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
  export function force_vested_transfer(
    value: Omit<t.types.pallet_vesting.pallet.Call.force_vested_transfer, "type">,
  ): t.types.pallet_vesting.pallet.Call.force_vested_transfer {
    return { type: "force_vested_transfer", ...value }
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
  export function merge_schedules(
    value: Omit<t.types.pallet_vesting.pallet.Call.merge_schedules, "type">,
  ): t.types.pallet_vesting.pallet.Call.merge_schedules {
    return { type: "merge_schedules", ...value }
  }
}

/** Error for the vesting pallet. */
export type Error =
  | "NotVesting"
  | "AtMaxVestingSchedules"
  | "AmountLow"
  | "ScheduleIndexOutOfBounds"
  | "InvalidScheduleParams"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.pallet_vesting.pallet.Event.VestingUpdated
  | t.types.pallet_vesting.pallet.Event.VestingCompleted
export namespace Event {
  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  export interface VestingUpdated {
    type: "VestingUpdated"
    account: t.types.sp_core.crypto.AccountId32
    unvested: t.types.u128
  }
  /** An \[account\] has become fully vested. */
  export interface VestingCompleted {
    type: "VestingCompleted"
    account: t.types.sp_core.crypto.AccountId32
  }
  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  export function VestingUpdated(
    value: Omit<t.types.pallet_vesting.pallet.Event.VestingUpdated, "type">,
  ): t.types.pallet_vesting.pallet.Event.VestingUpdated {
    return { type: "VestingUpdated", ...value }
  }
  /** An \[account\] has become fully vested. */
  export function VestingCompleted(
    value: Omit<t.types.pallet_vesting.pallet.Event.VestingCompleted, "type">,
  ): t.types.pallet_vesting.pallet.Event.VestingCompleted {
    return { type: "VestingCompleted", ...value }
  }
}
