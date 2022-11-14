import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_nomination_pools.pallet.Call.join
  | types.pallet_nomination_pools.pallet.Call.bond_extra
  | types.pallet_nomination_pools.pallet.Call.claim_payout
  | types.pallet_nomination_pools.pallet.Call.unbond
  | types.pallet_nomination_pools.pallet.Call.pool_withdraw_unbonded
  | types.pallet_nomination_pools.pallet.Call.withdraw_unbonded
  | types.pallet_nomination_pools.pallet.Call.create
  | types.pallet_nomination_pools.pallet.Call.nominate
  | types.pallet_nomination_pools.pallet.Call.set_state
  | types.pallet_nomination_pools.pallet.Call.set_metadata
  | types.pallet_nomination_pools.pallet.Call.set_configs
  | types.pallet_nomination_pools.pallet.Call.update_roles
  | types.pallet_nomination_pools.pallet.Call.chill
export namespace Call {
  /**
   * Stake funds with a pool. The amount to bond is transferred from the member to the
   * pools account and immediately increases the pools bond.
   *
   * # Note
   *
   * * An account can only be a member of a single pool.
   * * An account cannot join the same pool multiple times.
   * * This call will *not* dust the member account, so the member must have at least
   *   `existential deposit + amount` in their account.
   * * Only a pool with [`PoolState::Open`] can be joined
   */
  export interface join {
    type: "join"
    amount: types.Compact<types.u128>
    pool_id: types.u32
  }
  /**
   * Bond `extra` more funds from `origin` into the pool to which they already belong.
   *
   * Additional funds can come from either the free balance of the account, of from the
   * accumulated rewards, see [`BondExtra`].
   *
   * Bonding extra funds implies an automatic payout of all pending rewards as well.
   */
  export interface bond_extra {
    type: "bond_extra"
    extra: types.pallet_nomination_pools.BondExtra
  }
  /**
   * A bonded member can use this to claim their payout based on the rewards that the pool
   * has accumulated since their last claimed payout (OR since joining if this is there first
   * time claiming rewards). The payout will be transferred to the member's account.
   *
   * The member will earn rewards pro rata based on the members stake vs the sum of the
   * members in the pools stake. Rewards do not "expire".
   */
  export interface claim_payout {
    type: "claim_payout"
  }
  /**
   * Unbond up to `unbonding_points` of the `member_account`'s funds from the pool. It
   * implicitly collects the rewards one last time, since not doing so would mean some
   * rewards would be forfeited.
   *
   * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
   * account).
   *
   * # Conditions for a permissionless dispatch.
   *
   * * The pool is blocked and the caller is either the root or state-toggler. This is
   *   refereed to as a kick.
   * * The pool is destroying and the member is not the depositor.
   * * The pool is destroying, the member is the depositor and no other members are in the
   *   pool.
   *
   * ## Conditions for permissioned dispatch (i.e. the caller is also the
   * `member_account`):
   *
   * * The caller is not the depositor.
   * * The caller is the depositor, the pool is destroying and no other members are in the
   *   pool.
   *
   * # Note
   *
   * If there are too many unlocking chunks to unbond with the pool account,
   * [`Call::pool_withdraw_unbonded`] can be called to try and minimize unlocking chunks. If
   * there are too many unlocking chunks, the result of this call will likely be the
   * `NoMoreChunks` error from the staking system.
   */
  export interface unbond {
    type: "unbond"
    member_account: types.sp_runtime.multiaddress.MultiAddress
    unbonding_points: types.Compact<types.u128>
  }
  /**
   * Call `withdraw_unbonded` for the pools account. This call can be made by any account.
   *
   * This is useful if their are too many unlocking chunks to call `unbond`, and some
   * can be cleared by withdrawing. In the case there are too many unlocking chunks, the user
   * would probably see an error like `NoMoreChunks` emitted from the staking system when
   * they attempt to unbond.
   */
  export interface pool_withdraw_unbonded {
    type: "pool_withdraw_unbonded"
    pool_id: types.u32
    num_slashing_spans: types.u32
  }
  /**
   * Withdraw unbonded funds from `member_account`. If no bonded funds can be unbonded, an
   * error is returned.
   *
   * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
   * account).
   *
   * # Conditions for a permissionless dispatch
   *
   * * The pool is in destroy mode and the target is not the depositor.
   * * The target is the depositor and they are the only member in the sub pools.
   * * The pool is blocked and the caller is either the root or state-toggler.
   *
   * # Conditions for permissioned dispatch
   *
   * * The caller is the target and they are not the depositor.
   *
   * # Note
   *
   * If the target is the depositor, the pool will be destroyed.
   */
  export interface withdraw_unbonded {
    type: "withdraw_unbonded"
    member_account: types.sp_runtime.multiaddress.MultiAddress
    num_slashing_spans: types.u32
  }
  /**
   * Create a new delegation pool.
   *
   * # Arguments
   *
   * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
   *   deposit since the pools creator cannot fully unbond funds until the pool is being
   *   destroyed.
   * * `index` - A disambiguation index for creating the account. Likely only useful when
   *   creating multiple pools in the same extrinsic.
   * * `root` - The account to set as [`PoolRoles::root`].
   * * `nominator` - The account to set as the [`PoolRoles::nominator`].
   * * `state_toggler` - The account to set as the [`PoolRoles::state_toggler`].
   *
   * # Note
   *
   * In addition to `amount`, the caller will transfer the existential deposit; so the caller
   * needs at have at least `amount + existential_deposit` transferrable.
   */
  export interface create {
    type: "create"
    amount: types.Compact<types.u128>
    root: types.sp_runtime.multiaddress.MultiAddress
    nominator: types.sp_runtime.multiaddress.MultiAddress
    state_toggler: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Nominate on behalf of the pool.
   *
   * The dispatch origin of this call must be signed by the pool nominator or the pool
   * root role.
   *
   * This directly forward the call to the staking pallet, on behalf of the pool bonded
   * account.
   */
  export interface nominate {
    type: "nominate"
    pool_id: types.u32
    validators: Array<types.sp_core.crypto.AccountId32>
  }
  /**
   * Set a new state for the pool.
   *
   * If a pool is already in the `Destroying` state, then under no condition can its state
   * change again.
   *
   * The dispatch origin of this call must be either:
   *
   * 1. signed by the state toggler, or the root role of the pool,
   * 2. if the pool conditions to be open are NOT met (as described by `ok_to_be_open`), and
   *    then the state of the pool can be permissionlessly changed to `Destroying`.
   */
  export interface set_state {
    type: "set_state"
    pool_id: types.u32
    state: types.pallet_nomination_pools.PoolState
  }
  /**
   * Set a new metadata for the pool.
   *
   * The dispatch origin of this call must be signed by the state toggler, or the root role
   * of the pool.
   */
  export interface set_metadata {
    type: "set_metadata"
    pool_id: types.u32
    metadata: Uint8Array
  }
  /**
   * Update configurations for the nomination pools. The origin for this call must be
   * Root.
   *
   * # Arguments
   *
   * * `min_join_bond` - Set [`MinJoinBond`].
   * * `min_create_bond` - Set [`MinCreateBond`].
   * * `max_pools` - Set [`MaxPools`].
   * * `max_members` - Set [`MaxPoolMembers`].
   * * `max_members_per_pool` - Set [`MaxPoolMembersPerPool`].
   */
  export interface set_configs {
    type: "set_configs"
    min_join_bond: types.pallet_nomination_pools.ConfigOp.$$u128
    min_create_bond: types.pallet_nomination_pools.ConfigOp.$$u128
    max_pools: types.pallet_nomination_pools.ConfigOp.$$u32
    max_members: types.pallet_nomination_pools.ConfigOp.$$u32
    max_members_per_pool: types.pallet_nomination_pools.ConfigOp.$$u32
  }
  /**
   * Update the roles of the pool.
   *
   * The root is the only entity that can change any of the roles, including itself,
   * excluding the depositor, who can never change.
   *
   * It emits an event, notifying UIs of the role change. This event is quite relevant to
   * most pool members and they should be informed of changes to pool roles.
   */
  export interface update_roles {
    type: "update_roles"
    pool_id: types.u32
    new_root: types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
    new_nominator: types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
    new_state_toggler: types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
  }
  /**
   * Chill on behalf of the pool.
   *
   * The dispatch origin of this call must be signed by the pool nominator or the pool
   * root role, same as [`Pallet::nominate`].
   *
   * This directly forward the call to the staking pallet, on behalf of the pool bonded
   * account.
   */
  export interface chill {
    type: "chill"
    pool_id: types.u32
  }
  /**
   * Stake funds with a pool. The amount to bond is transferred from the member to the
   * pools account and immediately increases the pools bond.
   *
   * # Note
   *
   * * An account can only be a member of a single pool.
   * * An account cannot join the same pool multiple times.
   * * This call will *not* dust the member account, so the member must have at least
   *   `existential deposit + amount` in their account.
   * * Only a pool with [`PoolState::Open`] can be joined
   */
  export function join(
    value: Omit<types.pallet_nomination_pools.pallet.Call.join, "type">,
  ): types.pallet_nomination_pools.pallet.Call.join {
    return { type: "join", ...value }
  }
  /**
   * Bond `extra` more funds from `origin` into the pool to which they already belong.
   *
   * Additional funds can come from either the free balance of the account, of from the
   * accumulated rewards, see [`BondExtra`].
   *
   * Bonding extra funds implies an automatic payout of all pending rewards as well.
   */
  export function bond_extra(
    value: Omit<types.pallet_nomination_pools.pallet.Call.bond_extra, "type">,
  ): types.pallet_nomination_pools.pallet.Call.bond_extra {
    return { type: "bond_extra", ...value }
  }
  /**
   * A bonded member can use this to claim their payout based on the rewards that the pool
   * has accumulated since their last claimed payout (OR since joining if this is there first
   * time claiming rewards). The payout will be transferred to the member's account.
   *
   * The member will earn rewards pro rata based on the members stake vs the sum of the
   * members in the pools stake. Rewards do not "expire".
   */
  export function claim_payout(): types.pallet_nomination_pools.pallet.Call.claim_payout {
    return { type: "claim_payout" }
  }
  /**
   * Unbond up to `unbonding_points` of the `member_account`'s funds from the pool. It
   * implicitly collects the rewards one last time, since not doing so would mean some
   * rewards would be forfeited.
   *
   * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
   * account).
   *
   * # Conditions for a permissionless dispatch.
   *
   * * The pool is blocked and the caller is either the root or state-toggler. This is
   *   refereed to as a kick.
   * * The pool is destroying and the member is not the depositor.
   * * The pool is destroying, the member is the depositor and no other members are in the
   *   pool.
   *
   * ## Conditions for permissioned dispatch (i.e. the caller is also the
   * `member_account`):
   *
   * * The caller is not the depositor.
   * * The caller is the depositor, the pool is destroying and no other members are in the
   *   pool.
   *
   * # Note
   *
   * If there are too many unlocking chunks to unbond with the pool account,
   * [`Call::pool_withdraw_unbonded`] can be called to try and minimize unlocking chunks. If
   * there are too many unlocking chunks, the result of this call will likely be the
   * `NoMoreChunks` error from the staking system.
   */
  export function unbond(
    value: Omit<types.pallet_nomination_pools.pallet.Call.unbond, "type">,
  ): types.pallet_nomination_pools.pallet.Call.unbond {
    return { type: "unbond", ...value }
  }
  /**
   * Call `withdraw_unbonded` for the pools account. This call can be made by any account.
   *
   * This is useful if their are too many unlocking chunks to call `unbond`, and some
   * can be cleared by withdrawing. In the case there are too many unlocking chunks, the user
   * would probably see an error like `NoMoreChunks` emitted from the staking system when
   * they attempt to unbond.
   */
  export function pool_withdraw_unbonded(
    value: Omit<types.pallet_nomination_pools.pallet.Call.pool_withdraw_unbonded, "type">,
  ): types.pallet_nomination_pools.pallet.Call.pool_withdraw_unbonded {
    return { type: "pool_withdraw_unbonded", ...value }
  }
  /**
   * Withdraw unbonded funds from `member_account`. If no bonded funds can be unbonded, an
   * error is returned.
   *
   * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
   * account).
   *
   * # Conditions for a permissionless dispatch
   *
   * * The pool is in destroy mode and the target is not the depositor.
   * * The target is the depositor and they are the only member in the sub pools.
   * * The pool is blocked and the caller is either the root or state-toggler.
   *
   * # Conditions for permissioned dispatch
   *
   * * The caller is the target and they are not the depositor.
   *
   * # Note
   *
   * If the target is the depositor, the pool will be destroyed.
   */
  export function withdraw_unbonded(
    value: Omit<types.pallet_nomination_pools.pallet.Call.withdraw_unbonded, "type">,
  ): types.pallet_nomination_pools.pallet.Call.withdraw_unbonded {
    return { type: "withdraw_unbonded", ...value }
  }
  /**
   * Create a new delegation pool.
   *
   * # Arguments
   *
   * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
   *   deposit since the pools creator cannot fully unbond funds until the pool is being
   *   destroyed.
   * * `index` - A disambiguation index for creating the account. Likely only useful when
   *   creating multiple pools in the same extrinsic.
   * * `root` - The account to set as [`PoolRoles::root`].
   * * `nominator` - The account to set as the [`PoolRoles::nominator`].
   * * `state_toggler` - The account to set as the [`PoolRoles::state_toggler`].
   *
   * # Note
   *
   * In addition to `amount`, the caller will transfer the existential deposit; so the caller
   * needs at have at least `amount + existential_deposit` transferrable.
   */
  export function create(
    value: Omit<types.pallet_nomination_pools.pallet.Call.create, "type">,
  ): types.pallet_nomination_pools.pallet.Call.create {
    return { type: "create", ...value }
  }
  /**
   * Nominate on behalf of the pool.
   *
   * The dispatch origin of this call must be signed by the pool nominator or the pool
   * root role.
   *
   * This directly forward the call to the staking pallet, on behalf of the pool bonded
   * account.
   */
  export function nominate(
    value: Omit<types.pallet_nomination_pools.pallet.Call.nominate, "type">,
  ): types.pallet_nomination_pools.pallet.Call.nominate {
    return { type: "nominate", ...value }
  }
  /**
   * Set a new state for the pool.
   *
   * If a pool is already in the `Destroying` state, then under no condition can its state
   * change again.
   *
   * The dispatch origin of this call must be either:
   *
   * 1. signed by the state toggler, or the root role of the pool,
   * 2. if the pool conditions to be open are NOT met (as described by `ok_to_be_open`), and
   *    then the state of the pool can be permissionlessly changed to `Destroying`.
   */
  export function set_state(
    value: Omit<types.pallet_nomination_pools.pallet.Call.set_state, "type">,
  ): types.pallet_nomination_pools.pallet.Call.set_state {
    return { type: "set_state", ...value }
  }
  /**
   * Set a new metadata for the pool.
   *
   * The dispatch origin of this call must be signed by the state toggler, or the root role
   * of the pool.
   */
  export function set_metadata(
    value: Omit<types.pallet_nomination_pools.pallet.Call.set_metadata, "type">,
  ): types.pallet_nomination_pools.pallet.Call.set_metadata {
    return { type: "set_metadata", ...value }
  }
  /**
   * Update configurations for the nomination pools. The origin for this call must be
   * Root.
   *
   * # Arguments
   *
   * * `min_join_bond` - Set [`MinJoinBond`].
   * * `min_create_bond` - Set [`MinCreateBond`].
   * * `max_pools` - Set [`MaxPools`].
   * * `max_members` - Set [`MaxPoolMembers`].
   * * `max_members_per_pool` - Set [`MaxPoolMembersPerPool`].
   */
  export function set_configs(
    value: Omit<types.pallet_nomination_pools.pallet.Call.set_configs, "type">,
  ): types.pallet_nomination_pools.pallet.Call.set_configs {
    return { type: "set_configs", ...value }
  }
  /**
   * Update the roles of the pool.
   *
   * The root is the only entity that can change any of the roles, including itself,
   * excluding the depositor, who can never change.
   *
   * It emits an event, notifying UIs of the role change. This event is quite relevant to
   * most pool members and they should be informed of changes to pool roles.
   */
  export function update_roles(
    value: Omit<types.pallet_nomination_pools.pallet.Call.update_roles, "type">,
  ): types.pallet_nomination_pools.pallet.Call.update_roles {
    return { type: "update_roles", ...value }
  }
  /**
   * Chill on behalf of the pool.
   *
   * The dispatch origin of this call must be signed by the pool nominator or the pool
   * root role, same as [`Pallet::nominate`].
   *
   * This directly forward the call to the staking pallet, on behalf of the pool bonded
   * account.
   */
  export function chill(
    value: Omit<types.pallet_nomination_pools.pallet.Call.chill, "type">,
  ): types.pallet_nomination_pools.pallet.Call.chill {
    return { type: "chill", ...value }
  }
}

export type DefensiveError =
  | "NotEnoughSpaceInUnbondPool"
  | "PoolNotFound"
  | "RewardPoolNotFound"
  | "SubPoolsNotFound"
  | "BondedStashKilledPrematurely"
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | types.pallet_nomination_pools.pallet.Error.PoolNotFound
  | types.pallet_nomination_pools.pallet.Error.PoolMemberNotFound
  | types.pallet_nomination_pools.pallet.Error.RewardPoolNotFound
  | types.pallet_nomination_pools.pallet.Error.SubPoolsNotFound
  | types.pallet_nomination_pools.pallet.Error.AccountBelongsToOtherPool
  | types.pallet_nomination_pools.pallet.Error.FullyUnbonding
  | types.pallet_nomination_pools.pallet.Error.MaxUnbondingLimit
  | types.pallet_nomination_pools.pallet.Error.CannotWithdrawAny
  | types.pallet_nomination_pools.pallet.Error.MinimumBondNotMet
  | types.pallet_nomination_pools.pallet.Error.OverflowRisk
  | types.pallet_nomination_pools.pallet.Error.NotDestroying
  | types.pallet_nomination_pools.pallet.Error.NotNominator
  | types.pallet_nomination_pools.pallet.Error.NotKickerOrDestroying
  | types.pallet_nomination_pools.pallet.Error.NotOpen
  | types.pallet_nomination_pools.pallet.Error.MaxPools
  | types.pallet_nomination_pools.pallet.Error.MaxPoolMembers
  | types.pallet_nomination_pools.pallet.Error.CanNotChangeState
  | types.pallet_nomination_pools.pallet.Error.DoesNotHavePermission
  | types.pallet_nomination_pools.pallet.Error.MetadataExceedsMaxLen
  | types.pallet_nomination_pools.pallet.Error.Defensive
  | types.pallet_nomination_pools.pallet.Error.PartialUnbondNotAllowedPermissionlessly
export namespace Error {
  /** A (bonded) pool id does not exist. */
  export interface PoolNotFound {
    type: "PoolNotFound"
  }
  /** An account is not a member. */
  export interface PoolMemberNotFound {
    type: "PoolMemberNotFound"
  }
  /** A reward pool does not exist. In all cases this is a system logic error. */
  export interface RewardPoolNotFound {
    type: "RewardPoolNotFound"
  }
  /** A sub pool does not exist. */
  export interface SubPoolsNotFound {
    type: "SubPoolsNotFound"
  }
  /**
   * An account is already delegating in another pool. An account may only belong to one
   * pool at a time.
   */
  export interface AccountBelongsToOtherPool {
    type: "AccountBelongsToOtherPool"
  }
  /**
   * The member is fully unbonded (and thus cannot access the bonded and reward pool
   * anymore to, for example, collect rewards).
   */
  export interface FullyUnbonding {
    type: "FullyUnbonding"
  }
  /** The member cannot unbond further chunks due to reaching the limit. */
  export interface MaxUnbondingLimit {
    type: "MaxUnbondingLimit"
  }
  /** None of the funds can be withdrawn yet because the bonding duration has not passed. */
  export interface CannotWithdrawAny {
    type: "CannotWithdrawAny"
  }
  /**
   * The amount does not meet the minimum bond to either join or create a pool.
   *
   * The depositor can never unbond to a value less than
   * `Pallet::depositor_min_bond`. The caller does not have nominating
   * permissions for the pool. Members can never unbond to a value below `MinJoinBond`.
   */
  export interface MinimumBondNotMet {
    type: "MinimumBondNotMet"
  }
  /** The transaction could not be executed due to overflow risk for the pool. */
  export interface OverflowRisk {
    type: "OverflowRisk"
  }
  /**
   * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
   * other members to be permissionlessly unbonded.
   */
  export interface NotDestroying {
    type: "NotDestroying"
  }
  /** The caller does not have nominating permissions for the pool. */
  export interface NotNominator {
    type: "NotNominator"
  }
  /** Either a) the caller cannot make a valid kick or b) the pool is not destroying. */
  export interface NotKickerOrDestroying {
    type: "NotKickerOrDestroying"
  }
  /** The pool is not open to join */
  export interface NotOpen {
    type: "NotOpen"
  }
  /** The system is maxed out on pools. */
  export interface MaxPools {
    type: "MaxPools"
  }
  /** Too many members in the pool or system. */
  export interface MaxPoolMembers {
    type: "MaxPoolMembers"
  }
  /** The pools state cannot be changed. */
  export interface CanNotChangeState {
    type: "CanNotChangeState"
  }
  /** The caller does not have adequate permissions. */
  export interface DoesNotHavePermission {
    type: "DoesNotHavePermission"
  }
  /** Metadata exceeds [`Config::MaxMetadataLen`] */
  export interface MetadataExceedsMaxLen {
    type: "MetadataExceedsMaxLen"
  }
  /**
   * Some error occurred that should never happen. This should be reported to the
   * maintainers.
   */
  export interface Defensive {
    type: "Defensive"
    value: types.pallet_nomination_pools.pallet.DefensiveError
  }
  /** Partial unbonding now allowed permissionlessly. */
  export interface PartialUnbondNotAllowedPermissionlessly {
    type: "PartialUnbondNotAllowedPermissionlessly"
  }
  /** A (bonded) pool id does not exist. */
  export function PoolNotFound(): types.pallet_nomination_pools.pallet.Error.PoolNotFound {
    return { type: "PoolNotFound" }
  }
  /** An account is not a member. */
  export function PoolMemberNotFound(): types.pallet_nomination_pools.pallet.Error.PoolMemberNotFound {
    return { type: "PoolMemberNotFound" }
  }
  /** A reward pool does not exist. In all cases this is a system logic error. */
  export function RewardPoolNotFound(): types.pallet_nomination_pools.pallet.Error.RewardPoolNotFound {
    return { type: "RewardPoolNotFound" }
  }
  /** A sub pool does not exist. */
  export function SubPoolsNotFound(): types.pallet_nomination_pools.pallet.Error.SubPoolsNotFound {
    return { type: "SubPoolsNotFound" }
  }
  /**
   * An account is already delegating in another pool. An account may only belong to one
   * pool at a time.
   */
  export function AccountBelongsToOtherPool(): types.pallet_nomination_pools.pallet.Error.AccountBelongsToOtherPool {
    return { type: "AccountBelongsToOtherPool" }
  }
  /**
   * The member is fully unbonded (and thus cannot access the bonded and reward pool
   * anymore to, for example, collect rewards).
   */
  export function FullyUnbonding(): types.pallet_nomination_pools.pallet.Error.FullyUnbonding {
    return { type: "FullyUnbonding" }
  }
  /** The member cannot unbond further chunks due to reaching the limit. */
  export function MaxUnbondingLimit(): types.pallet_nomination_pools.pallet.Error.MaxUnbondingLimit {
    return { type: "MaxUnbondingLimit" }
  }
  /** None of the funds can be withdrawn yet because the bonding duration has not passed. */
  export function CannotWithdrawAny(): types.pallet_nomination_pools.pallet.Error.CannotWithdrawAny {
    return { type: "CannotWithdrawAny" }
  }
  /**
   * The amount does not meet the minimum bond to either join or create a pool.
   *
   * The depositor can never unbond to a value less than
   * `Pallet::depositor_min_bond`. The caller does not have nominating
   * permissions for the pool. Members can never unbond to a value below `MinJoinBond`.
   */
  export function MinimumBondNotMet(): types.pallet_nomination_pools.pallet.Error.MinimumBondNotMet {
    return { type: "MinimumBondNotMet" }
  }
  /** The transaction could not be executed due to overflow risk for the pool. */
  export function OverflowRisk(): types.pallet_nomination_pools.pallet.Error.OverflowRisk {
    return { type: "OverflowRisk" }
  }
  /**
   * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
   * other members to be permissionlessly unbonded.
   */
  export function NotDestroying(): types.pallet_nomination_pools.pallet.Error.NotDestroying {
    return { type: "NotDestroying" }
  }
  /** The caller does not have nominating permissions for the pool. */
  export function NotNominator(): types.pallet_nomination_pools.pallet.Error.NotNominator {
    return { type: "NotNominator" }
  }
  /** Either a) the caller cannot make a valid kick or b) the pool is not destroying. */
  export function NotKickerOrDestroying(): types.pallet_nomination_pools.pallet.Error.NotKickerOrDestroying {
    return { type: "NotKickerOrDestroying" }
  }
  /** The pool is not open to join */
  export function NotOpen(): types.pallet_nomination_pools.pallet.Error.NotOpen {
    return { type: "NotOpen" }
  }
  /** The system is maxed out on pools. */
  export function MaxPools(): types.pallet_nomination_pools.pallet.Error.MaxPools {
    return { type: "MaxPools" }
  }
  /** Too many members in the pool or system. */
  export function MaxPoolMembers(): types.pallet_nomination_pools.pallet.Error.MaxPoolMembers {
    return { type: "MaxPoolMembers" }
  }
  /** The pools state cannot be changed. */
  export function CanNotChangeState(): types.pallet_nomination_pools.pallet.Error.CanNotChangeState {
    return { type: "CanNotChangeState" }
  }
  /** The caller does not have adequate permissions. */
  export function DoesNotHavePermission(): types.pallet_nomination_pools.pallet.Error.DoesNotHavePermission {
    return { type: "DoesNotHavePermission" }
  }
  /** Metadata exceeds [`Config::MaxMetadataLen`] */
  export function MetadataExceedsMaxLen(): types.pallet_nomination_pools.pallet.Error.MetadataExceedsMaxLen {
    return { type: "MetadataExceedsMaxLen" }
  }
  /**
   * Some error occurred that should never happen. This should be reported to the
   * maintainers.
   */
  export function Defensive(
    value: types.pallet_nomination_pools.pallet.Error.Defensive["value"],
  ): types.pallet_nomination_pools.pallet.Error.Defensive {
    return { type: "Defensive", value }
  }
  /** Partial unbonding now allowed permissionlessly. */
  export function PartialUnbondNotAllowedPermissionlessly(): types.pallet_nomination_pools.pallet.Error.PartialUnbondNotAllowedPermissionlessly {
    return { type: "PartialUnbondNotAllowedPermissionlessly" }
  }
}
/** Events of this pallet. */

export type Event =
  | types.pallet_nomination_pools.pallet.Event.Created
  | types.pallet_nomination_pools.pallet.Event.Bonded
  | types.pallet_nomination_pools.pallet.Event.PaidOut
  | types.pallet_nomination_pools.pallet.Event.Unbonded
  | types.pallet_nomination_pools.pallet.Event.Withdrawn
  | types.pallet_nomination_pools.pallet.Event.Destroyed
  | types.pallet_nomination_pools.pallet.Event.StateChanged
  | types.pallet_nomination_pools.pallet.Event.MemberRemoved
  | types.pallet_nomination_pools.pallet.Event.RolesUpdated
  | types.pallet_nomination_pools.pallet.Event.PoolSlashed
  | types.pallet_nomination_pools.pallet.Event.UnbondingPoolSlashed
export namespace Event {
  /** A pool has been created. */
  export interface Created {
    type: "Created"
    depositor: types.sp_core.crypto.AccountId32
    pool_id: types.u32
  }
  /** A member has became bonded in a pool. */
  export interface Bonded {
    type: "Bonded"
    member: types.sp_core.crypto.AccountId32
    pool_id: types.u32
    bonded: types.u128
    joined: boolean
  }
  /** A payout has been made to a member. */
  export interface PaidOut {
    type: "PaidOut"
    member: types.sp_core.crypto.AccountId32
    pool_id: types.u32
    payout: types.u128
  }
  /**
   * A member has unbonded from their pool.
   *
   * - `balance` is the corresponding balance of the number of points that has been
   *   requested to be unbonded (the argument of the `unbond` transaction) from the bonded
   *   pool.
   * - `points` is the number of points that are issued as a result of `balance` being
   * dissolved into the corresponding unbonding pool.
   * - `era` is the era in which the balance will be unbonded.
   * In the absence of slashing, these values will match. In the presence of slashing, the
   * number of points that are issued in the unbonding pool will be less than the amount
   * requested to be unbonded.
   */
  export interface Unbonded {
    type: "Unbonded"
    member: types.sp_core.crypto.AccountId32
    pool_id: types.u32
    balance: types.u128
    points: types.u128
    era: types.u32
  }
  /**
   * A member has withdrawn from their pool.
   *
   * The given number of `points` have been dissolved in return of `balance`.
   *
   * Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
   * will be 1.
   */
  export interface Withdrawn {
    type: "Withdrawn"
    member: types.sp_core.crypto.AccountId32
    pool_id: types.u32
    balance: types.u128
    points: types.u128
  }
  /** A pool has been destroyed. */
  export interface Destroyed {
    type: "Destroyed"
    pool_id: types.u32
  }
  /** The state of a pool has changed */
  export interface StateChanged {
    type: "StateChanged"
    pool_id: types.u32
    new_state: types.pallet_nomination_pools.PoolState
  }
  /**
   * A member has been removed from a pool.
   *
   * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
   */
  export interface MemberRemoved {
    type: "MemberRemoved"
    pool_id: types.u32
    member: types.sp_core.crypto.AccountId32
  }
  /**
   * The roles of a pool have been updated to the given new roles. Note that the depositor
   * can never change.
   */
  export interface RolesUpdated {
    type: "RolesUpdated"
    root: types.sp_core.crypto.AccountId32 | undefined
    state_toggler: types.sp_core.crypto.AccountId32 | undefined
    nominator: types.sp_core.crypto.AccountId32 | undefined
  }
  /** The active balance of pool `pool_id` has been slashed to `balance`. */
  export interface PoolSlashed {
    type: "PoolSlashed"
    pool_id: types.u32
    balance: types.u128
  }
  /** The unbond pool at `era` of pool `pool_id` has been slashed to `balance`. */
  export interface UnbondingPoolSlashed {
    type: "UnbondingPoolSlashed"
    pool_id: types.u32
    era: types.u32
    balance: types.u128
  }
  /** A pool has been created. */
  export function Created(
    value: Omit<types.pallet_nomination_pools.pallet.Event.Created, "type">,
  ): types.pallet_nomination_pools.pallet.Event.Created {
    return { type: "Created", ...value }
  }
  /** A member has became bonded in a pool. */
  export function Bonded(
    value: Omit<types.pallet_nomination_pools.pallet.Event.Bonded, "type">,
  ): types.pallet_nomination_pools.pallet.Event.Bonded {
    return { type: "Bonded", ...value }
  }
  /** A payout has been made to a member. */
  export function PaidOut(
    value: Omit<types.pallet_nomination_pools.pallet.Event.PaidOut, "type">,
  ): types.pallet_nomination_pools.pallet.Event.PaidOut {
    return { type: "PaidOut", ...value }
  }
  /**
   * A member has unbonded from their pool.
   *
   * - `balance` is the corresponding balance of the number of points that has been
   *   requested to be unbonded (the argument of the `unbond` transaction) from the bonded
   *   pool.
   * - `points` is the number of points that are issued as a result of `balance` being
   * dissolved into the corresponding unbonding pool.
   * - `era` is the era in which the balance will be unbonded.
   * In the absence of slashing, these values will match. In the presence of slashing, the
   * number of points that are issued in the unbonding pool will be less than the amount
   * requested to be unbonded.
   */
  export function Unbonded(
    value: Omit<types.pallet_nomination_pools.pallet.Event.Unbonded, "type">,
  ): types.pallet_nomination_pools.pallet.Event.Unbonded {
    return { type: "Unbonded", ...value }
  }
  /**
   * A member has withdrawn from their pool.
   *
   * The given number of `points` have been dissolved in return of `balance`.
   *
   * Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
   * will be 1.
   */
  export function Withdrawn(
    value: Omit<types.pallet_nomination_pools.pallet.Event.Withdrawn, "type">,
  ): types.pallet_nomination_pools.pallet.Event.Withdrawn {
    return { type: "Withdrawn", ...value }
  }
  /** A pool has been destroyed. */
  export function Destroyed(
    value: Omit<types.pallet_nomination_pools.pallet.Event.Destroyed, "type">,
  ): types.pallet_nomination_pools.pallet.Event.Destroyed {
    return { type: "Destroyed", ...value }
  }
  /** The state of a pool has changed */
  export function StateChanged(
    value: Omit<types.pallet_nomination_pools.pallet.Event.StateChanged, "type">,
  ): types.pallet_nomination_pools.pallet.Event.StateChanged {
    return { type: "StateChanged", ...value }
  }
  /**
   * A member has been removed from a pool.
   *
   * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
   */
  export function MemberRemoved(
    value: Omit<types.pallet_nomination_pools.pallet.Event.MemberRemoved, "type">,
  ): types.pallet_nomination_pools.pallet.Event.MemberRemoved {
    return { type: "MemberRemoved", ...value }
  }
  /**
   * The roles of a pool have been updated to the given new roles. Note that the depositor
   * can never change.
   */
  export function RolesUpdated(
    value: Omit<types.pallet_nomination_pools.pallet.Event.RolesUpdated, "type">,
  ): types.pallet_nomination_pools.pallet.Event.RolesUpdated {
    return { type: "RolesUpdated", ...value }
  }
  /** The active balance of pool `pool_id` has been slashed to `balance`. */
  export function PoolSlashed(
    value: Omit<types.pallet_nomination_pools.pallet.Event.PoolSlashed, "type">,
  ): types.pallet_nomination_pools.pallet.Event.PoolSlashed {
    return { type: "PoolSlashed", ...value }
  }
  /** The unbond pool at `era` of pool `pool_id` has been slashed to `balance`. */
  export function UnbondingPoolSlashed(
    value: Omit<types.pallet_nomination_pools.pallet.Event.UnbondingPoolSlashed, "type">,
  ): types.pallet_nomination_pools.pallet.Event.UnbondingPoolSlashed {
    return { type: "UnbondingPoolSlashed", ...value }
  }
}
