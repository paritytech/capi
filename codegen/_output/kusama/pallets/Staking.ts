import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  The active era information, it holds index and start.
 *
 *  The active era is the era being currently rewarded. Validator set of this era must be
 *  equal to [`SessionInterface::validators`].
 */
export const ActiveEra = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Staking",
  "ActiveEra",
  $.tuple(),
  _codec.$492,
)

/** Map from all locked "stash" accounts to the controller account. */
export const Bonded = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "Bonded",
  $.tuple(_codec.$0),
  _codec.$0,
)

/**
 *  A mapping from still-bonded eras to the first session index of that era.
 *
 *  Must contains information for eras for the range:
 *  `[active_era - bounding_duration; active_era]`
 */
export const BondedEras = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "BondedEras",
  $.tuple(),
  _codec.$158,
)

/**
 *  The amount of currency given to reporters of a slash event which was
 *  canceled by extraordinary circumstances (e.g. governance).
 */
export const CanceledSlashPayout = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "CanceledSlashPayout",
  $.tuple(),
  _codec.$6,
)

/**
 *  The threshold for when users can start calling `chill_other` for other validators /
 *  nominators. The threshold is compared to the actual number of validators / nominators
 *  (`CountFor*`) in the system compared to the configured max (`Max*Count`).
 */
export const ChillThreshold = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Staking",
  "ChillThreshold",
  $.tuple(),
  _codec.$205,
)

/** Counter for the related counted storage map */
export const CounterForNominators = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "CounterForNominators",
  $.tuple(),
  _codec.$4,
)

/** Counter for the related counted storage map */
export const CounterForValidators = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "CounterForValidators",
  $.tuple(),
  _codec.$4,
)

/**
 *  The current era index.
 *
 *  This is the latest planned era, depending on how the Session pallet queues the validator
 *  set, it might be active or not.
 */
export const CurrentEra = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Staking",
  "CurrentEra",
  $.tuple(),
  _codec.$4,
)

/**
 *  The last planned session scheduled by the session pallet.
 *
 *  This is basically in sync with the call to [`pallet_session::SessionManager::new_session`].
 */
export const CurrentPlannedSession = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "CurrentPlannedSession",
  $.tuple(),
  _codec.$4,
)

/**
 *  Rewards for the last `HISTORY_DEPTH` eras.
 *  If reward hasn't been set or has been removed then 0 reward is returned.
 */
export const ErasRewardPoints = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "ErasRewardPoints",
  $.tuple(_codec.$4),
  _codec.$495,
)

/**
 *  Exposure of validator at era.
 *
 *  This is keyed first by the era index to allow bulk deletion and then the stash account.
 *
 *  Is it removed after `HISTORY_DEPTH` eras.
 *  If stakers hasn't been set or has been removed then empty exposure is returned.
 */
export const ErasStakers = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "ErasStakers",
  _codec.$494,
  _codec.$57,
)

/**
 *  Clipped Exposure of validator at era.
 *
 *  This is similar to [`ErasStakers`] but number of nominators exposed is reduced to the
 *  `T::MaxNominatorRewardedPerValidator` biggest stakers.
 *  (Note: the field `total` and `own` of the exposure remains unchanged).
 *  This is used to limit the i/o cost for the nominator payout.
 *
 *  This is keyed fist by the era index to allow bulk deletion and then the stash account.
 *
 *  Is it removed after `HISTORY_DEPTH` eras.
 *  If stakers hasn't been set or has been removed then empty exposure is returned.
 */
export const ErasStakersClipped = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "ErasStakersClipped",
  _codec.$494,
  _codec.$57,
)

/**
 *  The session index at which the era start for the last `HISTORY_DEPTH` eras.
 *
 *  Note: This tracks the starting session (i.e. session index when era start being active)
 *  for the eras in `[CurrentEra - HISTORY_DEPTH, CurrentEra]`.
 */
export const ErasStartSessionIndex = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "ErasStartSessionIndex",
  $.tuple(_codec.$4),
  _codec.$4,
)

/**
 *  The total amount staked for the last `HISTORY_DEPTH` eras.
 *  If total hasn't been set or has been removed then 0 stake is returned.
 */
export const ErasTotalStake = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "ErasTotalStake",
  $.tuple(_codec.$4),
  _codec.$6,
)

/**
 *  Similar to `ErasStakers`, this holds the preferences of validators.
 *
 *  This is keyed first by the era index to allow bulk deletion and then the stash account.
 *
 *  Is it removed after `HISTORY_DEPTH` eras.
 */
export const ErasValidatorPrefs = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "ErasValidatorPrefs",
  _codec.$494,
  _codec.$40,
)

/**
 *  The total validator era payout for the last `HISTORY_DEPTH` eras.
 *
 *  Eras that haven't finished yet or has been removed doesn't have reward.
 */
export const ErasValidatorReward = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "ErasValidatorReward",
  $.tuple(_codec.$4),
  _codec.$6,
)

/** Mode of era forcing. */
export const ForceEra = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "ForceEra",
  $.tuple(),
  _codec.$499,
)

/**
 *  Any validators that may never be slashed or forcibly kicked. It's a Vec since they're
 *  easy to initialize and the performance hit is minimal (we expect no more than four
 *  invulnerables) and restricted to testnets.
 */
export const Invulnerables = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "Invulnerables",
  $.tuple(),
  _codec.$206,
)

/** Map from all (unlocked) "controller" accounts to the info regarding the staking. */
export const Ledger = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "Ledger",
  $.tuple(_codec.$0),
  _codec.$485,
)

/**
 *  The maximum nominator count before we stop allowing new validators to join.
 *
 *  When this value is not set, no limits are enforced.
 */
export const MaxNominatorsCount = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Staking",
  "MaxNominatorsCount",
  $.tuple(),
  _codec.$4,
)

/**
 *  The maximum validator count before we stop allowing new validators to join.
 *
 *  When this value is not set, no limits are enforced.
 */
export const MaxValidatorsCount = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Staking",
  "MaxValidatorsCount",
  $.tuple(),
  _codec.$4,
)

/**
 *  The minimum amount of commission that validators can set.
 *
 *  If set to `0`, no limit exists.
 */
export const MinCommission = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "MinCommission",
  $.tuple(),
  _codec.$42,
)

/** The minimum active bond to become and maintain the role of a nominator. */
export const MinNominatorBond = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "MinNominatorBond",
  $.tuple(),
  _codec.$6,
)

/** The minimum active bond to become and maintain the role of a validator. */
export const MinValidatorBond = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "MinValidatorBond",
  $.tuple(),
  _codec.$6,
)

/** Minimum number of staking participants before emergency conditions are imposed. */
export const MinimumValidatorCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "MinimumValidatorCount",
  $.tuple(),
  _codec.$4,
)

/** All slashing events on nominators, mapped by era to the highest slash value of the era. */
export const NominatorSlashInEra = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "NominatorSlashInEra",
  _codec.$494,
  _codec.$6,
)

/**
 *  The map from nominator stash key to their nomination preferences, namely the validators that
 *  they wish to support.
 *
 *  Note that the keys of this storage map might become non-decodable in case the
 *  [`Config::MaxNominations`] configuration is decreased. In this rare case, these nominators
 *  are still existent in storage, their key is correct and retrievable (i.e. `contains_key`
 *  indicates that they exist), but their value cannot be decoded. Therefore, the non-decodable
 *  nominators will effectively not-exist, until they re-submit their preferences such that it
 *  is within the bounds of the newly set `Config::MaxNominations`.
 *
 *  This implies that `::iter_keys().count()` and `::iter().count()` might return different
 *  values for this map. Moreover, the main `::count()` is aligned with the former, namely the
 *  number of keys that exist.
 *
 *  Lastly, if any of the nominators become non-decodable, they can be chilled immediately via
 *  [`Call::chill_other`] dispatchable by anyone.
 */
export const Nominators = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "Nominators",
  $.tuple(_codec.$0),
  _codec.$490,
)

/**
 *  Indices of validators that have offended in the active era and whether they are currently
 *  disabled.
 *
 *  This value should be a superset of disabled validators since not all offences lead to the
 *  validator being disabled (if there was no slash). This is needed to track the percentage of
 *  validators that have offended in the current era, ensuring a new era is forced if
 *  `OffendingValidatorsThreshold` is reached. The vec is always kept sorted so that we can find
 *  whether a given validator has previously offended using binary search. It gets cleared when
 *  the era ends.
 */
export const OffendingValidators = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "OffendingValidators",
  $.tuple(),
  _codec.$505,
)

/** Where the reward payment should be made. Keyed by stash. */
export const Payee = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "Payee",
  $.tuple(_codec.$0),
  _codec.$203,
)

/**
 *  The percentage of the slash that is distributed to reporters.
 *
 *  The rest of the slashed value is handled by the `Slash`.
 */
export const SlashRewardFraction = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "SlashRewardFraction",
  $.tuple(),
  _codec.$42,
)

/** Slashing spans for stash accounts. */
export const SlashingSpans = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "SlashingSpans",
  $.tuple(_codec.$0),
  _codec.$503,
)

/**
 *  Records information about the maximum slash of a stash within a slashing span,
 *  as well as how much reward has been paid out.
 */
export const SpanSlash = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "SpanSlash",
  $.tuple(_codec.$498),
  _codec.$504,
)

/**
 *  True if network has been upgraded to this version.
 *  Storage version of the pallet.
 *
 *  This is set to v7.0.0 for new networks.
 */
export const StorageVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "StorageVersion",
  $.tuple(),
  _codec.$507,
)

/** All unapplied slashes that are queued for later. */
export const UnappliedSlashes = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "UnappliedSlashes",
  $.tuple(_codec.$4),
  _codec.$500,
)

/** The ideal number of staking participants. */
export const ValidatorCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Staking",
  "ValidatorCount",
  $.tuple(),
  _codec.$4,
)

/**
 *  All slashing events on validators, mapped by era to the highest slash proportion
 *  and slash value of the era.
 */
export const ValidatorSlashInEra = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Staking",
  "ValidatorSlashInEra",
  _codec.$494,
  _codec.$502,
)

/** The map from (wannabe) validator stash key to the preferences of that validator. */
export const Validators = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Staking",
  "Validators",
  $.tuple(_codec.$0),
  _codec.$40,
)

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
  value: Omit<types.pallet_staking.pallet.pallet.Call.bond, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "bond" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.bond_extra, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "bond_extra" } }
}

/**
 * Cancel enactment of a deferred slash.
 *
 * Can be called by the `T::SlashCancelOrigin`.
 *
 * Parameters: era and indices of the slashes for that era to kill.
 */
export function cancel_deferred_slash(
  value: Omit<types.pallet_staking.pallet.pallet.Call.cancel_deferred_slash, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "cancel_deferred_slash" } }
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
export function chill(): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { type: "chill" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.chill_other, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "chill_other" } }
}

/**
 * Force a validator to have at least the minimum commission. This will not affect a
 * validator who already has a commission greater than or equal to the minimum. Any account
 * can call this.
 */
export function force_apply_min_commission(
  value: Omit<types.pallet_staking.pallet.pallet.Call.force_apply_min_commission, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "force_apply_min_commission" } }
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
export function force_new_era(): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { type: "force_new_era" } }
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
export function force_new_era_always(): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { type: "force_new_era_always" } }
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
export function force_no_eras(): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { type: "force_no_eras" } }
}

/**
 * Force a current staker to become completely unstaked, immediately.
 *
 * The dispatch origin must be Root.
 */
export function force_unstake(
  value: Omit<types.pallet_staking.pallet.pallet.Call.force_unstake, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "force_unstake" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.increase_validator_count, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "increase_validator_count" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.kick, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "kick" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.nominate, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "nominate" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.payout_stakers, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "payout_stakers" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.reap_stash, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "reap_stash" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.rebond, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "rebond" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.scale_validator_count, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "scale_validator_count" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.set_controller, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "set_controller" } }
}

/**
 * Set the validators who cannot be slashed (if any).
 *
 * The dispatch origin must be Root.
 */
export function set_invulnerables(
  value: Omit<types.pallet_staking.pallet.pallet.Call.set_invulnerables, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "set_invulnerables" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.set_payee, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "set_payee" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.set_staking_configs, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "set_staking_configs" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.set_validator_count, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "set_validator_count" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.unbond, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "unbond" } }
}

/**
 * Declare the desire to validate for the origin controller.
 *
 * Effects will be felt at the beginning of the next era.
 *
 * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
 */
export function validate(
  value: Omit<types.pallet_staking.pallet.pallet.Call.validate, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "validate" } }
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
  value: Omit<types.pallet_staking.pallet.pallet.Call.withdraw_unbonded, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Staking", value: { ...value, type: "withdraw_unbonded" } }
}
