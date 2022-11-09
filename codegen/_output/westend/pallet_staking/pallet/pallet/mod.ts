import { $, BitSequence, ChainError, Era } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"
export const $call: $.Codec<t.pallet_staking.pallet.pallet.Call> = _codec.$202

export const $error: $.Codec<t.pallet_staking.pallet.pallet.Error> = _codec.$508

export const $event: $.Codec<t.pallet_staking.pallet.pallet.Event> = _codec.$39

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_staking.pallet.pallet.Call.bond
  | t.pallet_staking.pallet.pallet.Call.bond_extra
  | t.pallet_staking.pallet.pallet.Call.unbond
  | t.pallet_staking.pallet.pallet.Call.withdraw_unbonded
  | t.pallet_staking.pallet.pallet.Call.validate
  | t.pallet_staking.pallet.pallet.Call.nominate
  | t.pallet_staking.pallet.pallet.Call.chill
  | t.pallet_staking.pallet.pallet.Call.set_payee
  | t.pallet_staking.pallet.pallet.Call.set_controller
  | t.pallet_staking.pallet.pallet.Call.set_validator_count
  | t.pallet_staking.pallet.pallet.Call.increase_validator_count
  | t.pallet_staking.pallet.pallet.Call.scale_validator_count
  | t.pallet_staking.pallet.pallet.Call.force_no_eras
  | t.pallet_staking.pallet.pallet.Call.force_new_era
  | t.pallet_staking.pallet.pallet.Call.set_invulnerables
  | t.pallet_staking.pallet.pallet.Call.force_unstake
  | t.pallet_staking.pallet.pallet.Call.force_new_era_always
  | t.pallet_staking.pallet.pallet.Call.cancel_deferred_slash
  | t.pallet_staking.pallet.pallet.Call.payout_stakers
  | t.pallet_staking.pallet.pallet.Call.rebond
  | t.pallet_staking.pallet.pallet.Call.reap_stash
  | t.pallet_staking.pallet.pallet.Call.kick
  | t.pallet_staking.pallet.pallet.Call.set_staking_configs
  | t.pallet_staking.pallet.pallet.Call.chill_other
  | t.pallet_staking.pallet.pallet.Call.force_apply_min_commission
export namespace Call {
  /**
   * Take the origin account as a stash and lock up `value` of its balance. `controller` will
   * be the account that controls it.
   *
   * `value` must be more than the `minimum_balance` specified by `T::Currency`.
   *
   * The dispatch origin for this call must be _Signed_ by the stash account.
   *
   * Emits `Bonded`.
   * # <weight>
   * - Independent of the arguments. Moderate complexity.
   * - O(1).
   * - Three extra DB entries.
   *
   * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
   * unless the `origin` falls below _existential deposit_ and gets removed as dust.
   * ------------------
   * # </weight>
   */
  export interface bond {
    type: "bond"
    controller: t.sp_runtime.multiaddress.MultiAddress
    value: t.Compact<t.u128>
    payee: t.pallet_staking.RewardDestination
  }
  /**
   * Add some extra amount that have appeared in the stash `free_balance` into the balance up
   * for staking.
   *
   * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
   *
   * Use this if there are additional funds in your stash account that you wish to bond.
   * Unlike [`bond`](Self::bond) or [`unbond`](Self::unbond) this function does not impose
   * any limitation on the amount that can be added.
   *
   * Emits `Bonded`.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - O(1).
   * # </weight>
   */
  export interface bond_extra {
    type: "bond_extra"
    max_additional: t.Compact<t.u128>
  }
  /**
   * Schedule a portion of the stash to be unlocked ready for transfer out after the bond
   * period ends. If this leaves an amount actively bonded less than
   * T::Currency::minimum_balance(), then it is increased to the full amount.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * Once the unlock period is done, you can call `withdraw_unbonded` to actually move
   * the funds out of management ready for transfer.
   *
   * No more than a limited number of unlocking chunks (see `MaxUnlockingChunks`)
   * can co-exists at the same time. In that case, [`Call::withdraw_unbonded`] need
   * to be called first to remove some of the chunks (if possible).
   *
   * If a user encounters the `InsufficientBond` error when calling this extrinsic,
   * they should call `chill` first in order to free up their bonded funds.
   *
   * Emits `Unbonded`.
   *
   * See also [`Call::withdraw_unbonded`].
   */
  export interface unbond {
    type: "unbond"
    value: t.Compact<t.u128>
  }
  /**
   * Remove any unlocked chunks from the `unlocking` queue from our management.
   *
   * This essentially frees up that balance to be used by the stash account to do
   * whatever it wants.
   *
   * The dispatch origin for this call must be _Signed_ by the controller.
   *
   * Emits `Withdrawn`.
   *
   * See also [`Call::unbond`].
   *
   * # <weight>
   * Complexity O(S) where S is the number of slashing spans to remove
   * NOTE: Weight annotation is the kill scenario, we refund otherwise.
   * # </weight>
   */
  export interface withdraw_unbonded {
    type: "withdraw_unbonded"
    num_slashing_spans: t.u32
  }
  /**
   * Declare the desire to validate for the origin controller.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   */
  export interface validate {
    type: "validate"
    prefs: t.pallet_staking.ValidatorPrefs
  }
  /**
   * Declare the desire to nominate `targets` for the origin controller.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * # <weight>
   * - The transaction's complexity is proportional to the size of `targets` (N)
   * which is capped at CompactAssignments::LIMIT (T::MaxNominations).
   * - Both the reads and writes follow a similar pattern.
   * # </weight>
   */
  export interface nominate {
    type: "nominate"
    targets: Array<t.sp_runtime.multiaddress.MultiAddress>
  }
  /**
   * Declare no desire to either validate or nominate.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - Contains one read.
   * - Writes are limited to the `origin` account key.
   * # </weight>
   */
  export interface chill {
    type: "chill"
  }
  /**
   * (Re-)set the payment target for a controller.
   *
   * Effects will be felt instantly (as soon as this function is completed successfully).
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - Contains a limited number of reads.
   * - Writes are limited to the `origin` account key.
   * ---------
   * - Weight: O(1)
   * - DB Weight:
   *     - Read: Ledger
   *     - Write: Payee
   * # </weight>
   */
  export interface set_payee {
    type: "set_payee"
    payee: t.pallet_staking.RewardDestination
  }
  /**
   * (Re-)set the controller of a stash.
   *
   * Effects will be felt instantly (as soon as this function is completed successfully).
   *
   * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - Contains a limited number of reads.
   * - Writes are limited to the `origin` account key.
   * ----------
   * Weight: O(1)
   * DB Weight:
   * - Read: Bonded, Ledger New Controller, Ledger Old Controller
   * - Write: Bonded, Ledger New Controller, Ledger Old Controller
   * # </weight>
   */
  export interface set_controller {
    type: "set_controller"
    controller: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Sets the ideal number of validators.
   *
   * The dispatch origin must be Root.
   *
   * # <weight>
   * Weight: O(1)
   * Write: Validator Count
   * # </weight>
   */
  export interface set_validator_count {
    type: "set_validator_count"
    new: t.Compact<t.u32>
  }
  /**
   * Increments the ideal number of validators.
   *
   * The dispatch origin must be Root.
   *
   * # <weight>
   * Same as [`Self::set_validator_count`].
   * # </weight>
   */
  export interface increase_validator_count {
    type: "increase_validator_count"
    additional: t.Compact<t.u32>
  }
  /**
   * Scale up the ideal number of validators by a factor.
   *
   * The dispatch origin must be Root.
   *
   * # <weight>
   * Same as [`Self::set_validator_count`].
   * # </weight>
   */
  export interface scale_validator_count {
    type: "scale_validator_count"
    factor: t.sp_arithmetic.per_things.Percent
  }
  /**
   * Force there to be no new eras indefinitely.
   *
   * The dispatch origin must be Root.
   *
   * # Warning
   *
   * The election process starts multiple blocks before the end of the era.
   * Thus the election process may be ongoing when this is called. In this case the
   * election will continue until the next era is triggered.
   *
   * # <weight>
   * - No arguments.
   * - Weight: O(1)
   * - Write: ForceEra
   * # </weight>
   */
  export interface force_no_eras {
    type: "force_no_eras"
  }
  /**
   * Force there to be a new era at the end of the next session. After this, it will be
   * reset to normal (non-forced) behaviour.
   *
   * The dispatch origin must be Root.
   *
   * # Warning
   *
   * The election process starts multiple blocks before the end of the era.
   * If this is called just before a new era is triggered, the election process may not
   * have enough blocks to get a result.
   *
   * # <weight>
   * - No arguments.
   * - Weight: O(1)
   * - Write ForceEra
   * # </weight>
   */
  export interface force_new_era {
    type: "force_new_era"
  }
  /**
   * Set the validators who cannot be slashed (if any).
   *
   * The dispatch origin must be Root.
   */
  export interface set_invulnerables {
    type: "set_invulnerables"
    invulnerables: Array<t.sp_core.crypto.AccountId32>
  }
  /**
   * Force a current staker to become completely unstaked, immediately.
   *
   * The dispatch origin must be Root.
   */
  export interface force_unstake {
    type: "force_unstake"
    stash: t.sp_core.crypto.AccountId32
    num_slashing_spans: t.u32
  }
  /**
   * Force there to be a new era at the end of sessions indefinitely.
   *
   * The dispatch origin must be Root.
   *
   * # Warning
   *
   * The election process starts multiple blocks before the end of the era.
   * If this is called just before a new era is triggered, the election process may not
   * have enough blocks to get a result.
   */
  export interface force_new_era_always {
    type: "force_new_era_always"
  }
  /**
   * Cancel enactment of a deferred slash.
   *
   * Can be called by the `T::SlashCancelOrigin`.
   *
   * Parameters: era and indices of the slashes for that era to kill.
   */
  export interface cancel_deferred_slash {
    type: "cancel_deferred_slash"
    era: t.u32
    slash_indices: Array<t.u32>
  }
  /**
   * Pay out all the stakers behind a single validator for a single era.
   *
   * - `validator_stash` is the stash account of the validator. Their nominators, up to
   *   `T::MaxNominatorRewardedPerValidator`, will also receive their rewards.
   * - `era` may be any era between `[current_era - history_depth; current_era]`.
   *
   * The origin of this call must be _Signed_. Any account can call this function, even if
   * it is not one of the stakers.
   *
   * # <weight>
   * - Time complexity: at most O(MaxNominatorRewardedPerValidator).
   * - Contains a limited number of reads and writes.
   * -----------
   * N is the Number of payouts for the validator (including the validator)
   * Weight:
   * - Reward Destination Staked: O(N)
   * - Reward Destination Controller (Creating): O(N)
   *
   *   NOTE: weights are assuming that payouts are made to alive stash account (Staked).
   *   Paying even a dead controller is cheaper weight-wise. We don't do any refunds here.
   * # </weight>
   */
  export interface payout_stakers {
    type: "payout_stakers"
    validator_stash: t.sp_core.crypto.AccountId32
    era: t.u32
  }
  /**
   * Rebond a portion of the stash scheduled to be unlocked.
   *
   * The dispatch origin must be signed by the controller.
   *
   * # <weight>
   * - Time complexity: O(L), where L is unlocking chunks
   * - Bounded by `MaxUnlockingChunks`.
   * - Storage changes: Can't increase storage, only decrease it.
   * # </weight>
   */
  export interface rebond {
    type: "rebond"
    value: t.Compact<t.u128>
  }
  /**
   * Remove all data structures concerning a staker/stash once it is at a state where it can
   * be considered `dust` in the staking system. The requirements are:
   *
   * 1. the `total_balance` of the stash is below existential deposit.
   * 2. or, the `ledger.total` of the stash is below existential deposit.
   *
   * The former can happen in cases like a slash; the latter when a fully unbonded account
   * is still receiving staking rewards in `RewardDestination::Staked`.
   *
   * It can be called by anyone, as long as `stash` meets the above requirements.
   *
   * Refunds the transaction fees upon successful execution.
   */
  export interface reap_stash {
    type: "reap_stash"
    stash: t.sp_core.crypto.AccountId32
    num_slashing_spans: t.u32
  }
  /**
   * Remove the given nominations from the calling validator.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * - `who`: A list of nominator stash accounts who are nominating this validator which
   *   should no longer be nominating this validator.
   *
   * Note: Making this call only makes sense if you first set the validator preferences to
   * block any further nominations.
   */
  export interface kick {
    type: "kick"
    who: Array<t.sp_runtime.multiaddress.MultiAddress>
  }
  /**
   * Update the various staking configurations .
   *
   * * `min_nominator_bond`: The minimum active bond needed to be a nominator.
   * * `min_validator_bond`: The minimum active bond needed to be a validator.
   * * `max_nominator_count`: The max number of users who can be a nominator at once. When
   *   set to `None`, no limit is enforced.
   * * `max_validator_count`: The max number of users who can be a validator at once. When
   *   set to `None`, no limit is enforced.
   * * `chill_threshold`: The ratio of `max_nominator_count` or `max_validator_count` which
   *   should be filled in order for the `chill_other` transaction to work.
   * * `min_commission`: The minimum amount of commission that each validators must maintain.
   *   This is checked only upon calling `validate`. Existing validators are not affected.
   *
   * RuntimeOrigin must be Root to call this function.
   *
   * NOTE: Existing nominators and validators will not be affected by this update.
   * to kick people under the new limits, `chill_other` should be called.
   */
  export interface set_staking_configs {
    type: "set_staking_configs"
    min_nominator_bond: t.pallet_staking.pallet.pallet.ConfigOp.$$u128
    min_validator_bond: t.pallet_staking.pallet.pallet.ConfigOp.$$u128
    max_nominator_count: t.pallet_staking.pallet.pallet.ConfigOp.$$u32
    max_validator_count: t.pallet_staking.pallet.pallet.ConfigOp.$$u32
    chill_threshold: t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent
    min_commission: t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill
  }
  /**
   * Declare a `controller` to stop participating as either a validator or nominator.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_, but can be called by anyone.
   *
   * If the caller is the same as the controller being targeted, then no further checks are
   * enforced, and this function behaves just like `chill`.
   *
   * If the caller is different than the controller being targeted, the following conditions
   * must be met:
   *
   * * `controller` must belong to a nominator who has become non-decodable,
   *
   * Or:
   *
   * * A `ChillThreshold` must be set and checked which defines how close to the max
   *   nominators or validators we must reach before users can start chilling one-another.
   * * A `MaxNominatorCount` and `MaxValidatorCount` must be set which is used to determine
   *   how close we are to the threshold.
   * * A `MinNominatorBond` and `MinValidatorBond` must be set and checked, which determines
   *   if this is a person that should be chilled because they have not met the threshold
   *   bond required.
   *
   * This can be helpful if bond requirements are updated, and we need to remove old users
   * who do not satisfy these requirements.
   */
  export interface chill_other {
    type: "chill_other"
    controller: t.sp_core.crypto.AccountId32
  }
  /**
   * Force a validator to have at least the minimum commission. This will not affect a
   * validator who already has a commission greater than or equal to the minimum. Any account
   * can call this.
   */
  export interface force_apply_min_commission {
    type: "force_apply_min_commission"
    validator_stash: t.sp_core.crypto.AccountId32
  }
  /**
   * Take the origin account as a stash and lock up `value` of its balance. `controller` will
   * be the account that controls it.
   *
   * `value` must be more than the `minimum_balance` specified by `T::Currency`.
   *
   * The dispatch origin for this call must be _Signed_ by the stash account.
   *
   * Emits `Bonded`.
   * # <weight>
   * - Independent of the arguments. Moderate complexity.
   * - O(1).
   * - Three extra DB entries.
   *
   * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
   * unless the `origin` falls below _existential deposit_ and gets removed as dust.
   * ------------------
   * # </weight>
   */
  export function bond(
    value: Omit<t.pallet_staking.pallet.pallet.Call.bond, "type">,
  ): t.pallet_staking.pallet.pallet.Call.bond {
    return { type: "bond", ...value }
  }
  /**
   * Add some extra amount that have appeared in the stash `free_balance` into the balance up
   * for staking.
   *
   * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
   *
   * Use this if there are additional funds in your stash account that you wish to bond.
   * Unlike [`bond`](Self::bond) or [`unbond`](Self::unbond) this function does not impose
   * any limitation on the amount that can be added.
   *
   * Emits `Bonded`.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - O(1).
   * # </weight>
   */
  export function bond_extra(
    value: Omit<t.pallet_staking.pallet.pallet.Call.bond_extra, "type">,
  ): t.pallet_staking.pallet.pallet.Call.bond_extra {
    return { type: "bond_extra", ...value }
  }
  /**
   * Schedule a portion of the stash to be unlocked ready for transfer out after the bond
   * period ends. If this leaves an amount actively bonded less than
   * T::Currency::minimum_balance(), then it is increased to the full amount.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * Once the unlock period is done, you can call `withdraw_unbonded` to actually move
   * the funds out of management ready for transfer.
   *
   * No more than a limited number of unlocking chunks (see `MaxUnlockingChunks`)
   * can co-exists at the same time. In that case, [`Call::withdraw_unbonded`] need
   * to be called first to remove some of the chunks (if possible).
   *
   * If a user encounters the `InsufficientBond` error when calling this extrinsic,
   * they should call `chill` first in order to free up their bonded funds.
   *
   * Emits `Unbonded`.
   *
   * See also [`Call::withdraw_unbonded`].
   */
  export function unbond(
    value: Omit<t.pallet_staking.pallet.pallet.Call.unbond, "type">,
  ): t.pallet_staking.pallet.pallet.Call.unbond {
    return { type: "unbond", ...value }
  }
  /**
   * Remove any unlocked chunks from the `unlocking` queue from our management.
   *
   * This essentially frees up that balance to be used by the stash account to do
   * whatever it wants.
   *
   * The dispatch origin for this call must be _Signed_ by the controller.
   *
   * Emits `Withdrawn`.
   *
   * See also [`Call::unbond`].
   *
   * # <weight>
   * Complexity O(S) where S is the number of slashing spans to remove
   * NOTE: Weight annotation is the kill scenario, we refund otherwise.
   * # </weight>
   */
  export function withdraw_unbonded(
    value: Omit<t.pallet_staking.pallet.pallet.Call.withdraw_unbonded, "type">,
  ): t.pallet_staking.pallet.pallet.Call.withdraw_unbonded {
    return { type: "withdraw_unbonded", ...value }
  }
  /**
   * Declare the desire to validate for the origin controller.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   */
  export function validate(
    value: Omit<t.pallet_staking.pallet.pallet.Call.validate, "type">,
  ): t.pallet_staking.pallet.pallet.Call.validate {
    return { type: "validate", ...value }
  }
  /**
   * Declare the desire to nominate `targets` for the origin controller.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * # <weight>
   * - The transaction's complexity is proportional to the size of `targets` (N)
   * which is capped at CompactAssignments::LIMIT (T::MaxNominations).
   * - Both the reads and writes follow a similar pattern.
   * # </weight>
   */
  export function nominate(
    value: Omit<t.pallet_staking.pallet.pallet.Call.nominate, "type">,
  ): t.pallet_staking.pallet.pallet.Call.nominate {
    return { type: "nominate", ...value }
  }
  /**
   * Declare no desire to either validate or nominate.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - Contains one read.
   * - Writes are limited to the `origin` account key.
   * # </weight>
   */
  export function chill(): t.pallet_staking.pallet.pallet.Call.chill {
    return { type: "chill" }
  }
  /**
   * (Re-)set the payment target for a controller.
   *
   * Effects will be felt instantly (as soon as this function is completed successfully).
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - Contains a limited number of reads.
   * - Writes are limited to the `origin` account key.
   * ---------
   * - Weight: O(1)
   * - DB Weight:
   *     - Read: Ledger
   *     - Write: Payee
   * # </weight>
   */
  export function set_payee(
    value: Omit<t.pallet_staking.pallet.pallet.Call.set_payee, "type">,
  ): t.pallet_staking.pallet.pallet.Call.set_payee {
    return { type: "set_payee", ...value }
  }
  /**
   * (Re-)set the controller of a stash.
   *
   * Effects will be felt instantly (as soon as this function is completed successfully).
   *
   * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
   *
   * # <weight>
   * - Independent of the arguments. Insignificant complexity.
   * - Contains a limited number of reads.
   * - Writes are limited to the `origin` account key.
   * ----------
   * Weight: O(1)
   * DB Weight:
   * - Read: Bonded, Ledger New Controller, Ledger Old Controller
   * - Write: Bonded, Ledger New Controller, Ledger Old Controller
   * # </weight>
   */
  export function set_controller(
    value: Omit<t.pallet_staking.pallet.pallet.Call.set_controller, "type">,
  ): t.pallet_staking.pallet.pallet.Call.set_controller {
    return { type: "set_controller", ...value }
  }
  /**
   * Sets the ideal number of validators.
   *
   * The dispatch origin must be Root.
   *
   * # <weight>
   * Weight: O(1)
   * Write: Validator Count
   * # </weight>
   */
  export function set_validator_count(
    value: Omit<t.pallet_staking.pallet.pallet.Call.set_validator_count, "type">,
  ): t.pallet_staking.pallet.pallet.Call.set_validator_count {
    return { type: "set_validator_count", ...value }
  }
  /**
   * Increments the ideal number of validators.
   *
   * The dispatch origin must be Root.
   *
   * # <weight>
   * Same as [`Self::set_validator_count`].
   * # </weight>
   */
  export function increase_validator_count(
    value: Omit<t.pallet_staking.pallet.pallet.Call.increase_validator_count, "type">,
  ): t.pallet_staking.pallet.pallet.Call.increase_validator_count {
    return { type: "increase_validator_count", ...value }
  }
  /**
   * Scale up the ideal number of validators by a factor.
   *
   * The dispatch origin must be Root.
   *
   * # <weight>
   * Same as [`Self::set_validator_count`].
   * # </weight>
   */
  export function scale_validator_count(
    value: Omit<t.pallet_staking.pallet.pallet.Call.scale_validator_count, "type">,
  ): t.pallet_staking.pallet.pallet.Call.scale_validator_count {
    return { type: "scale_validator_count", ...value }
  }
  /**
   * Force there to be no new eras indefinitely.
   *
   * The dispatch origin must be Root.
   *
   * # Warning
   *
   * The election process starts multiple blocks before the end of the era.
   * Thus the election process may be ongoing when this is called. In this case the
   * election will continue until the next era is triggered.
   *
   * # <weight>
   * - No arguments.
   * - Weight: O(1)
   * - Write: ForceEra
   * # </weight>
   */
  export function force_no_eras(): t.pallet_staking.pallet.pallet.Call.force_no_eras {
    return { type: "force_no_eras" }
  }
  /**
   * Force there to be a new era at the end of the next session. After this, it will be
   * reset to normal (non-forced) behaviour.
   *
   * The dispatch origin must be Root.
   *
   * # Warning
   *
   * The election process starts multiple blocks before the end of the era.
   * If this is called just before a new era is triggered, the election process may not
   * have enough blocks to get a result.
   *
   * # <weight>
   * - No arguments.
   * - Weight: O(1)
   * - Write ForceEra
   * # </weight>
   */
  export function force_new_era(): t.pallet_staking.pallet.pallet.Call.force_new_era {
    return { type: "force_new_era" }
  }
  /**
   * Set the validators who cannot be slashed (if any).
   *
   * The dispatch origin must be Root.
   */
  export function set_invulnerables(
    value: Omit<t.pallet_staking.pallet.pallet.Call.set_invulnerables, "type">,
  ): t.pallet_staking.pallet.pallet.Call.set_invulnerables {
    return { type: "set_invulnerables", ...value }
  }
  /**
   * Force a current staker to become completely unstaked, immediately.
   *
   * The dispatch origin must be Root.
   */
  export function force_unstake(
    value: Omit<t.pallet_staking.pallet.pallet.Call.force_unstake, "type">,
  ): t.pallet_staking.pallet.pallet.Call.force_unstake {
    return { type: "force_unstake", ...value }
  }
  /**
   * Force there to be a new era at the end of sessions indefinitely.
   *
   * The dispatch origin must be Root.
   *
   * # Warning
   *
   * The election process starts multiple blocks before the end of the era.
   * If this is called just before a new era is triggered, the election process may not
   * have enough blocks to get a result.
   */
  export function force_new_era_always(): t.pallet_staking.pallet.pallet.Call.force_new_era_always {
    return { type: "force_new_era_always" }
  }
  /**
   * Cancel enactment of a deferred slash.
   *
   * Can be called by the `T::SlashCancelOrigin`.
   *
   * Parameters: era and indices of the slashes for that era to kill.
   */
  export function cancel_deferred_slash(
    value: Omit<t.pallet_staking.pallet.pallet.Call.cancel_deferred_slash, "type">,
  ): t.pallet_staking.pallet.pallet.Call.cancel_deferred_slash {
    return { type: "cancel_deferred_slash", ...value }
  }
  /**
   * Pay out all the stakers behind a single validator for a single era.
   *
   * - `validator_stash` is the stash account of the validator. Their nominators, up to
   *   `T::MaxNominatorRewardedPerValidator`, will also receive their rewards.
   * - `era` may be any era between `[current_era - history_depth; current_era]`.
   *
   * The origin of this call must be _Signed_. Any account can call this function, even if
   * it is not one of the stakers.
   *
   * # <weight>
   * - Time complexity: at most O(MaxNominatorRewardedPerValidator).
   * - Contains a limited number of reads and writes.
   * -----------
   * N is the Number of payouts for the validator (including the validator)
   * Weight:
   * - Reward Destination Staked: O(N)
   * - Reward Destination Controller (Creating): O(N)
   *
   *   NOTE: weights are assuming that payouts are made to alive stash account (Staked).
   *   Paying even a dead controller is cheaper weight-wise. We don't do any refunds here.
   * # </weight>
   */
  export function payout_stakers(
    value: Omit<t.pallet_staking.pallet.pallet.Call.payout_stakers, "type">,
  ): t.pallet_staking.pallet.pallet.Call.payout_stakers {
    return { type: "payout_stakers", ...value }
  }
  /**
   * Rebond a portion of the stash scheduled to be unlocked.
   *
   * The dispatch origin must be signed by the controller.
   *
   * # <weight>
   * - Time complexity: O(L), where L is unlocking chunks
   * - Bounded by `MaxUnlockingChunks`.
   * - Storage changes: Can't increase storage, only decrease it.
   * # </weight>
   */
  export function rebond(
    value: Omit<t.pallet_staking.pallet.pallet.Call.rebond, "type">,
  ): t.pallet_staking.pallet.pallet.Call.rebond {
    return { type: "rebond", ...value }
  }
  /**
   * Remove all data structures concerning a staker/stash once it is at a state where it can
   * be considered `dust` in the staking system. The requirements are:
   *
   * 1. the `total_balance` of the stash is below existential deposit.
   * 2. or, the `ledger.total` of the stash is below existential deposit.
   *
   * The former can happen in cases like a slash; the latter when a fully unbonded account
   * is still receiving staking rewards in `RewardDestination::Staked`.
   *
   * It can be called by anyone, as long as `stash` meets the above requirements.
   *
   * Refunds the transaction fees upon successful execution.
   */
  export function reap_stash(
    value: Omit<t.pallet_staking.pallet.pallet.Call.reap_stash, "type">,
  ): t.pallet_staking.pallet.pallet.Call.reap_stash {
    return { type: "reap_stash", ...value }
  }
  /**
   * Remove the given nominations from the calling validator.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
   *
   * - `who`: A list of nominator stash accounts who are nominating this validator which
   *   should no longer be nominating this validator.
   *
   * Note: Making this call only makes sense if you first set the validator preferences to
   * block any further nominations.
   */
  export function kick(
    value: Omit<t.pallet_staking.pallet.pallet.Call.kick, "type">,
  ): t.pallet_staking.pallet.pallet.Call.kick {
    return { type: "kick", ...value }
  }
  /**
   * Update the various staking configurations .
   *
   * * `min_nominator_bond`: The minimum active bond needed to be a nominator.
   * * `min_validator_bond`: The minimum active bond needed to be a validator.
   * * `max_nominator_count`: The max number of users who can be a nominator at once. When
   *   set to `None`, no limit is enforced.
   * * `max_validator_count`: The max number of users who can be a validator at once. When
   *   set to `None`, no limit is enforced.
   * * `chill_threshold`: The ratio of `max_nominator_count` or `max_validator_count` which
   *   should be filled in order for the `chill_other` transaction to work.
   * * `min_commission`: The minimum amount of commission that each validators must maintain.
   *   This is checked only upon calling `validate`. Existing validators are not affected.
   *
   * RuntimeOrigin must be Root to call this function.
   *
   * NOTE: Existing nominators and validators will not be affected by this update.
   * to kick people under the new limits, `chill_other` should be called.
   */
  export function set_staking_configs(
    value: Omit<t.pallet_staking.pallet.pallet.Call.set_staking_configs, "type">,
  ): t.pallet_staking.pallet.pallet.Call.set_staking_configs {
    return { type: "set_staking_configs", ...value }
  }
  /**
   * Declare a `controller` to stop participating as either a validator or nominator.
   *
   * Effects will be felt at the beginning of the next era.
   *
   * The dispatch origin for this call must be _Signed_, but can be called by anyone.
   *
   * If the caller is the same as the controller being targeted, then no further checks are
   * enforced, and this function behaves just like `chill`.
   *
   * If the caller is different than the controller being targeted, the following conditions
   * must be met:
   *
   * * `controller` must belong to a nominator who has become non-decodable,
   *
   * Or:
   *
   * * A `ChillThreshold` must be set and checked which defines how close to the max
   *   nominators or validators we must reach before users can start chilling one-another.
   * * A `MaxNominatorCount` and `MaxValidatorCount` must be set which is used to determine
   *   how close we are to the threshold.
   * * A `MinNominatorBond` and `MinValidatorBond` must be set and checked, which determines
   *   if this is a person that should be chilled because they have not met the threshold
   *   bond required.
   *
   * This can be helpful if bond requirements are updated, and we need to remove old users
   * who do not satisfy these requirements.
   */
  export function chill_other(
    value: Omit<t.pallet_staking.pallet.pallet.Call.chill_other, "type">,
  ): t.pallet_staking.pallet.pallet.Call.chill_other {
    return { type: "chill_other", ...value }
  }
  /**
   * Force a validator to have at least the minimum commission. This will not affect a
   * validator who already has a commission greater than or equal to the minimum. Any account
   * can call this.
   */
  export function force_apply_min_commission(
    value: Omit<t.pallet_staking.pallet.pallet.Call.force_apply_min_commission, "type">,
  ): t.pallet_staking.pallet.pallet.Call.force_apply_min_commission {
    return { type: "force_apply_min_commission", ...value }
  }
}

export * as ConfigOp from "./ConfigOp/mod.ts"

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "NotController"
  | "NotStash"
  | "AlreadyBonded"
  | "AlreadyPaired"
  | "EmptyTargets"
  | "DuplicateIndex"
  | "InvalidSlashIndex"
  | "InsufficientBond"
  | "NoMoreChunks"
  | "NoUnlockChunk"
  | "FundedTarget"
  | "InvalidEraToReward"
  | "InvalidNumberOfNominations"
  | "NotSortedAndUnique"
  | "AlreadyClaimed"
  | "IncorrectHistoryDepth"
  | "IncorrectSlashingSpans"
  | "BadState"
  | "TooManyTargets"
  | "BadTarget"
  | "CannotChillOther"
  | "TooManyNominators"
  | "TooManyValidators"
  | "CommissionTooLow"
  | "BoundNotMet"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_staking.pallet.pallet.Event.EraPaid
  | t.pallet_staking.pallet.pallet.Event.Rewarded
  | t.pallet_staking.pallet.pallet.Event.Slashed
  | t.pallet_staking.pallet.pallet.Event.OldSlashingReportDiscarded
  | t.pallet_staking.pallet.pallet.Event.StakersElected
  | t.pallet_staking.pallet.pallet.Event.Bonded
  | t.pallet_staking.pallet.pallet.Event.Unbonded
  | t.pallet_staking.pallet.pallet.Event.Withdrawn
  | t.pallet_staking.pallet.pallet.Event.Kicked
  | t.pallet_staking.pallet.pallet.Event.StakingElectionFailed
  | t.pallet_staking.pallet.pallet.Event.Chilled
  | t.pallet_staking.pallet.pallet.Event.PayoutStarted
  | t.pallet_staking.pallet.pallet.Event.ValidatorPrefsSet
export namespace Event {
  /**
   * The era payout has been set; the first balance is the validator-payout; the second is
   * the remainder from the maximum amount of reward.
   */
  export interface EraPaid {
    type: "EraPaid"
    era_index: t.u32
    validator_payout: t.u128
    remainder: t.u128
  }
  /** The nominator has been rewarded by this amount. */
  export interface Rewarded {
    type: "Rewarded"
    stash: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** One staker (and potentially its nominators) has been slashed by the given amount. */
  export interface Slashed {
    type: "Slashed"
    staker: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /**
   * An old slashing report from a prior era was discarded because it could
   * not be processed.
   */
  export interface OldSlashingReportDiscarded {
    type: "OldSlashingReportDiscarded"
    session_index: t.u32
  }
  /** A new set of stakers was elected. */
  export interface StakersElected {
    type: "StakersElected"
  }
  /**
   * An account has bonded this amount. \[stash, amount\]
   *
   * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
   * it will not be emitted for staking rewards when they are added to stake.
   */
  export interface Bonded {
    type: "Bonded"
    stash: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** An account has unbonded this amount. */
  export interface Unbonded {
    type: "Unbonded"
    stash: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /**
   * An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
   * from the unlocking queue.
   */
  export interface Withdrawn {
    type: "Withdrawn"
    stash: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** A nominator has been kicked from a validator. */
  export interface Kicked {
    type: "Kicked"
    nominator: t.sp_core.crypto.AccountId32
    stash: t.sp_core.crypto.AccountId32
  }
  /** The election failed. No new era is planned. */
  export interface StakingElectionFailed {
    type: "StakingElectionFailed"
  }
  /** An account has stopped participating as either a validator or nominator. */
  export interface Chilled {
    type: "Chilled"
    stash: t.sp_core.crypto.AccountId32
  }
  /** The stakers' rewards are getting paid. */
  export interface PayoutStarted {
    type: "PayoutStarted"
    era_index: t.u32
    validator_stash: t.sp_core.crypto.AccountId32
  }
  /** A validator has set their preferences. */
  export interface ValidatorPrefsSet {
    type: "ValidatorPrefsSet"
    stash: t.sp_core.crypto.AccountId32
    prefs: t.pallet_staking.ValidatorPrefs
  }
  /**
   * The era payout has been set; the first balance is the validator-payout; the second is
   * the remainder from the maximum amount of reward.
   */
  export function EraPaid(
    value: Omit<t.pallet_staking.pallet.pallet.Event.EraPaid, "type">,
  ): t.pallet_staking.pallet.pallet.Event.EraPaid {
    return { type: "EraPaid", ...value }
  }
  /** The nominator has been rewarded by this amount. */
  export function Rewarded(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Rewarded, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Rewarded {
    return { type: "Rewarded", ...value }
  }
  /** One staker (and potentially its nominators) has been slashed by the given amount. */
  export function Slashed(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Slashed, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Slashed {
    return { type: "Slashed", ...value }
  }
  /**
   * An old slashing report from a prior era was discarded because it could
   * not be processed.
   */
  export function OldSlashingReportDiscarded(
    value: Omit<t.pallet_staking.pallet.pallet.Event.OldSlashingReportDiscarded, "type">,
  ): t.pallet_staking.pallet.pallet.Event.OldSlashingReportDiscarded {
    return { type: "OldSlashingReportDiscarded", ...value }
  }
  /** A new set of stakers was elected. */
  export function StakersElected(): t.pallet_staking.pallet.pallet.Event.StakersElected {
    return { type: "StakersElected" }
  }
  /**
   * An account has bonded this amount. \[stash, amount\]
   *
   * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
   * it will not be emitted for staking rewards when they are added to stake.
   */
  export function Bonded(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Bonded, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Bonded {
    return { type: "Bonded", ...value }
  }
  /** An account has unbonded this amount. */
  export function Unbonded(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Unbonded, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Unbonded {
    return { type: "Unbonded", ...value }
  }
  /**
   * An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
   * from the unlocking queue.
   */
  export function Withdrawn(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Withdrawn, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Withdrawn {
    return { type: "Withdrawn", ...value }
  }
  /** A nominator has been kicked from a validator. */
  export function Kicked(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Kicked, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Kicked {
    return { type: "Kicked", ...value }
  }
  /** The election failed. No new era is planned. */
  export function StakingElectionFailed(): t.pallet_staking.pallet.pallet.Event.StakingElectionFailed {
    return { type: "StakingElectionFailed" }
  }
  /** An account has stopped participating as either a validator or nominator. */
  export function Chilled(
    value: Omit<t.pallet_staking.pallet.pallet.Event.Chilled, "type">,
  ): t.pallet_staking.pallet.pallet.Event.Chilled {
    return { type: "Chilled", ...value }
  }
  /** The stakers' rewards are getting paid. */
  export function PayoutStarted(
    value: Omit<t.pallet_staking.pallet.pallet.Event.PayoutStarted, "type">,
  ): t.pallet_staking.pallet.pallet.Event.PayoutStarted {
    return { type: "PayoutStarted", ...value }
  }
  /** A validator has set their preferences. */
  export function ValidatorPrefsSet(
    value: Omit<t.pallet_staking.pallet.pallet.Event.ValidatorPrefsSet, "type">,
  ): t.pallet_staking.pallet.pallet.Event.ValidatorPrefsSet {
    return { type: "ValidatorPrefsSet", ...value }
  }
}
