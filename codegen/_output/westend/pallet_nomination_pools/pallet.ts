import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.pallet_nomination_pools.pallet.Call> = _codec.$369

export const $defensiveError: $.Codec<t.pallet_nomination_pools.pallet.DefensiveError> = _codec.$633

export const $error: $.Codec<t.pallet_nomination_pools.pallet.Error> = _codec.$632

export const $event: $.Codec<t.pallet_nomination_pools.pallet.Event> = _codec.$90

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_nomination_pools.pallet.Call.join
  | t.pallet_nomination_pools.pallet.Call.bond_extra
  | t.pallet_nomination_pools.pallet.Call.claim_payout
  | t.pallet_nomination_pools.pallet.Call.unbond
  | t.pallet_nomination_pools.pallet.Call.pool_withdraw_unbonded
  | t.pallet_nomination_pools.pallet.Call.withdraw_unbonded
  | t.pallet_nomination_pools.pallet.Call.create
  | t.pallet_nomination_pools.pallet.Call.nominate
  | t.pallet_nomination_pools.pallet.Call.set_state
  | t.pallet_nomination_pools.pallet.Call.set_metadata
  | t.pallet_nomination_pools.pallet.Call.set_configs
  | t.pallet_nomination_pools.pallet.Call.update_roles
  | t.pallet_nomination_pools.pallet.Call.chill
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
    amount: t.Compact<t.u128>
    pool_id: t.u32
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
    extra: t.pallet_nomination_pools.BondExtra
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
    member_account: t.sp_runtime.multiaddress.MultiAddress
    unbonding_points: t.Compact<t.u128>
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
    pool_id: t.u32
    num_slashing_spans: t.u32
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
    member_account: t.sp_runtime.multiaddress.MultiAddress
    num_slashing_spans: t.u32
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
    amount: t.Compact<t.u128>
    root: t.sp_runtime.multiaddress.MultiAddress
    nominator: t.sp_runtime.multiaddress.MultiAddress
    state_toggler: t.sp_runtime.multiaddress.MultiAddress
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
    pool_id: t.u32
    validators: Array<t.sp_core.crypto.AccountId32>
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
    pool_id: t.u32
    state: t.pallet_nomination_pools.PoolState
  }
  /**
   * Set a new metadata for the pool.
   *
   * The dispatch origin of this call must be signed by the state toggler, or the root role
   * of the pool.
   */
  export interface set_metadata {
    type: "set_metadata"
    pool_id: t.u32
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
    min_join_bond: t.pallet_nomination_pools.ConfigOp.$$u128
    min_create_bond: t.pallet_nomination_pools.ConfigOp.$$u128
    max_pools: t.pallet_nomination_pools.ConfigOp.$$u32
    max_members: t.pallet_nomination_pools.ConfigOp.$$u32
    max_members_per_pool: t.pallet_nomination_pools.ConfigOp.$$u32
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
    pool_id: t.u32
    new_root: t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
    new_nominator: t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
    new_state_toggler: t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
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
    pool_id: t.u32
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.join, "type">,
  ): t.pallet_nomination_pools.pallet.Call.join {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.bond_extra, "type">,
  ): t.pallet_nomination_pools.pallet.Call.bond_extra {
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
  export function claim_payout(): t.pallet_nomination_pools.pallet.Call.claim_payout {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.unbond, "type">,
  ): t.pallet_nomination_pools.pallet.Call.unbond {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.pool_withdraw_unbonded, "type">,
  ): t.pallet_nomination_pools.pallet.Call.pool_withdraw_unbonded {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.withdraw_unbonded, "type">,
  ): t.pallet_nomination_pools.pallet.Call.withdraw_unbonded {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.create, "type">,
  ): t.pallet_nomination_pools.pallet.Call.create {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.nominate, "type">,
  ): t.pallet_nomination_pools.pallet.Call.nominate {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.set_state, "type">,
  ): t.pallet_nomination_pools.pallet.Call.set_state {
    return { type: "set_state", ...value }
  }
  /**
   * Set a new metadata for the pool.
   *
   * The dispatch origin of this call must be signed by the state toggler, or the root role
   * of the pool.
   */
  export function set_metadata(
    value: Omit<t.pallet_nomination_pools.pallet.Call.set_metadata, "type">,
  ): t.pallet_nomination_pools.pallet.Call.set_metadata {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.set_configs, "type">,
  ): t.pallet_nomination_pools.pallet.Call.set_configs {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.update_roles, "type">,
  ): t.pallet_nomination_pools.pallet.Call.update_roles {
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
    value: Omit<t.pallet_nomination_pools.pallet.Call.chill, "type">,
  ): t.pallet_nomination_pools.pallet.Call.chill {
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
  | t.pallet_nomination_pools.pallet.Error.PoolNotFound
  | t.pallet_nomination_pools.pallet.Error.PoolMemberNotFound
  | t.pallet_nomination_pools.pallet.Error.RewardPoolNotFound
  | t.pallet_nomination_pools.pallet.Error.SubPoolsNotFound
  | t.pallet_nomination_pools.pallet.Error.AccountBelongsToOtherPool
  | t.pallet_nomination_pools.pallet.Error.FullyUnbonding
  | t.pallet_nomination_pools.pallet.Error.MaxUnbondingLimit
  | t.pallet_nomination_pools.pallet.Error.CannotWithdrawAny
  | t.pallet_nomination_pools.pallet.Error.MinimumBondNotMet
  | t.pallet_nomination_pools.pallet.Error.OverflowRisk
  | t.pallet_nomination_pools.pallet.Error.NotDestroying
  | t.pallet_nomination_pools.pallet.Error.NotNominator
  | t.pallet_nomination_pools.pallet.Error.NotKickerOrDestroying
  | t.pallet_nomination_pools.pallet.Error.NotOpen
  | t.pallet_nomination_pools.pallet.Error.MaxPools
  | t.pallet_nomination_pools.pallet.Error.MaxPoolMembers
  | t.pallet_nomination_pools.pallet.Error.CanNotChangeState
  | t.pallet_nomination_pools.pallet.Error.DoesNotHavePermission
  | t.pallet_nomination_pools.pallet.Error.MetadataExceedsMaxLen
  | t.pallet_nomination_pools.pallet.Error.Defensive
  | t.pallet_nomination_pools.pallet.Error.PartialUnbondNotAllowedPermissionlessly
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
    value: t.pallet_nomination_pools.pallet.DefensiveError
  }
  /** Partial unbonding now allowed permissionlessly. */
  export interface PartialUnbondNotAllowedPermissionlessly {
    type: "PartialUnbondNotAllowedPermissionlessly"
  }
  /** A (bonded) pool id does not exist. */
  export function PoolNotFound(): t.pallet_nomination_pools.pallet.Error.PoolNotFound {
    return { type: "PoolNotFound" }
  }
  /** An account is not a member. */
  export function PoolMemberNotFound(): t.pallet_nomination_pools.pallet.Error.PoolMemberNotFound {
    return { type: "PoolMemberNotFound" }
  }
  /** A reward pool does not exist. In all cases this is a system logic error. */
  export function RewardPoolNotFound(): t.pallet_nomination_pools.pallet.Error.RewardPoolNotFound {
    return { type: "RewardPoolNotFound" }
  }
  /** A sub pool does not exist. */
  export function SubPoolsNotFound(): t.pallet_nomination_pools.pallet.Error.SubPoolsNotFound {
    return { type: "SubPoolsNotFound" }
  }
  /**
   * An account is already delegating in another pool. An account may only belong to one
   * pool at a time.
   */
  export function AccountBelongsToOtherPool(): t.pallet_nomination_pools.pallet.Error.AccountBelongsToOtherPool {
    return { type: "AccountBelongsToOtherPool" }
  }
  /**
   * The member is fully unbonded (and thus cannot access the bonded and reward pool
   * anymore to, for example, collect rewards).
   */
  export function FullyUnbonding(): t.pallet_nomination_pools.pallet.Error.FullyUnbonding {
    return { type: "FullyUnbonding" }
  }
  /** The member cannot unbond further chunks due to reaching the limit. */
  export function MaxUnbondingLimit(): t.pallet_nomination_pools.pallet.Error.MaxUnbondingLimit {
    return { type: "MaxUnbondingLimit" }
  }
  /** None of the funds can be withdrawn yet because the bonding duration has not passed. */
  export function CannotWithdrawAny(): t.pallet_nomination_pools.pallet.Error.CannotWithdrawAny {
    return { type: "CannotWithdrawAny" }
  }
  /**
   * The amount does not meet the minimum bond to either join or create a pool.
   *
   * The depositor can never unbond to a value less than
   * `Pallet::depositor_min_bond`. The caller does not have nominating
   * permissions for the pool. Members can never unbond to a value below `MinJoinBond`.
   */
  export function MinimumBondNotMet(): t.pallet_nomination_pools.pallet.Error.MinimumBondNotMet {
    return { type: "MinimumBondNotMet" }
  }
  /** The transaction could not be executed due to overflow risk for the pool. */
  export function OverflowRisk(): t.pallet_nomination_pools.pallet.Error.OverflowRisk {
    return { type: "OverflowRisk" }
  }
  /**
   * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
   * other members to be permissionlessly unbonded.
   */
  export function NotDestroying(): t.pallet_nomination_pools.pallet.Error.NotDestroying {
    return { type: "NotDestroying" }
  }
  /** The caller does not have nominating permissions for the pool. */
  export function NotNominator(): t.pallet_nomination_pools.pallet.Error.NotNominator {
    return { type: "NotNominator" }
  }
  /** Either a) the caller cannot make a valid kick or b) the pool is not destroying. */
  export function NotKickerOrDestroying(): t.pallet_nomination_pools.pallet.Error.NotKickerOrDestroying {
    return { type: "NotKickerOrDestroying" }
  }
  /** The pool is not open to join */
  export function NotOpen(): t.pallet_nomination_pools.pallet.Error.NotOpen {
    return { type: "NotOpen" }
  }
  /** The system is maxed out on pools. */
  export function MaxPools(): t.pallet_nomination_pools.pallet.Error.MaxPools {
    return { type: "MaxPools" }
  }
  /** Too many members in the pool or system. */
  export function MaxPoolMembers(): t.pallet_nomination_pools.pallet.Error.MaxPoolMembers {
    return { type: "MaxPoolMembers" }
  }
  /** The pools state cannot be changed. */
  export function CanNotChangeState(): t.pallet_nomination_pools.pallet.Error.CanNotChangeState {
    return { type: "CanNotChangeState" }
  }
  /** The caller does not have adequate permissions. */
  export function DoesNotHavePermission(): t.pallet_nomination_pools.pallet.Error.DoesNotHavePermission {
    return { type: "DoesNotHavePermission" }
  }
  /** Metadata exceeds [`Config::MaxMetadataLen`] */
  export function MetadataExceedsMaxLen(): t.pallet_nomination_pools.pallet.Error.MetadataExceedsMaxLen {
    return { type: "MetadataExceedsMaxLen" }
  }
  /**
   * Some error occurred that should never happen. This should be reported to the
   * maintainers.
   */
  export function Defensive(
    value: t.pallet_nomination_pools.pallet.Error.Defensive["value"],
  ): t.pallet_nomination_pools.pallet.Error.Defensive {
    return { type: "Defensive", value }
  }
  /** Partial unbonding now allowed permissionlessly. */
  export function PartialUnbondNotAllowedPermissionlessly(): t.pallet_nomination_pools.pallet.Error.PartialUnbondNotAllowedPermissionlessly {
    return { type: "PartialUnbondNotAllowedPermissionlessly" }
  }
}

/** Events of this pallet. */
export type Event =
  | t.pallet_nomination_pools.pallet.Event.Created
  | t.pallet_nomination_pools.pallet.Event.Bonded
  | t.pallet_nomination_pools.pallet.Event.PaidOut
  | t.pallet_nomination_pools.pallet.Event.Unbonded
  | t.pallet_nomination_pools.pallet.Event.Withdrawn
  | t.pallet_nomination_pools.pallet.Event.Destroyed
  | t.pallet_nomination_pools.pallet.Event.StateChanged
  | t.pallet_nomination_pools.pallet.Event.MemberRemoved
  | t.pallet_nomination_pools.pallet.Event.RolesUpdated
  | t.pallet_nomination_pools.pallet.Event.PoolSlashed
  | t.pallet_nomination_pools.pallet.Event.UnbondingPoolSlashed
export namespace Event {
  /** A pool has been created. */
  export interface Created {
    type: "Created"
    depositor: t.sp_core.crypto.AccountId32
    pool_id: t.u32
  }
  /** A member has became bonded in a pool. */
  export interface Bonded {
    type: "Bonded"
    member: t.sp_core.crypto.AccountId32
    pool_id: t.u32
    bonded: t.u128
    joined: boolean
  }
  /** A payout has been made to a member. */
  export interface PaidOut {
    type: "PaidOut"
    member: t.sp_core.crypto.AccountId32
    pool_id: t.u32
    payout: t.u128
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
    member: t.sp_core.crypto.AccountId32
    pool_id: t.u32
    balance: t.u128
    points: t.u128
    era: t.u32
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
    member: t.sp_core.crypto.AccountId32
    pool_id: t.u32
    balance: t.u128
    points: t.u128
  }
  /** A pool has been destroyed. */
  export interface Destroyed {
    type: "Destroyed"
    pool_id: t.u32
  }
  /** The state of a pool has changed */
  export interface StateChanged {
    type: "StateChanged"
    pool_id: t.u32
    new_state: t.pallet_nomination_pools.PoolState
  }
  /**
   * A member has been removed from a pool.
   *
   * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
   */
  export interface MemberRemoved {
    type: "MemberRemoved"
    pool_id: t.u32
    member: t.sp_core.crypto.AccountId32
  }
  /**
   * The roles of a pool have been updated to the given new roles. Note that the depositor
   * can never change.
   */
  export interface RolesUpdated {
    type: "RolesUpdated"
    root: t.sp_core.crypto.AccountId32 | undefined
    state_toggler: t.sp_core.crypto.AccountId32 | undefined
    nominator: t.sp_core.crypto.AccountId32 | undefined
  }
  /** The active balance of pool `pool_id` has been slashed to `balance`. */
  export interface PoolSlashed {
    type: "PoolSlashed"
    pool_id: t.u32
    balance: t.u128
  }
  /** The unbond pool at `era` of pool `pool_id` has been slashed to `balance`. */
  export interface UnbondingPoolSlashed {
    type: "UnbondingPoolSlashed"
    pool_id: t.u32
    era: t.u32
    balance: t.u128
  }
  /** A pool has been created. */
  export function Created(
    value: Omit<t.pallet_nomination_pools.pallet.Event.Created, "type">,
  ): t.pallet_nomination_pools.pallet.Event.Created {
    return { type: "Created", ...value }
  }
  /** A member has became bonded in a pool. */
  export function Bonded(
    value: Omit<t.pallet_nomination_pools.pallet.Event.Bonded, "type">,
  ): t.pallet_nomination_pools.pallet.Event.Bonded {
    return { type: "Bonded", ...value }
  }
  /** A payout has been made to a member. */
  export function PaidOut(
    value: Omit<t.pallet_nomination_pools.pallet.Event.PaidOut, "type">,
  ): t.pallet_nomination_pools.pallet.Event.PaidOut {
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
    value: Omit<t.pallet_nomination_pools.pallet.Event.Unbonded, "type">,
  ): t.pallet_nomination_pools.pallet.Event.Unbonded {
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
    value: Omit<t.pallet_nomination_pools.pallet.Event.Withdrawn, "type">,
  ): t.pallet_nomination_pools.pallet.Event.Withdrawn {
    return { type: "Withdrawn", ...value }
  }
  /** A pool has been destroyed. */
  export function Destroyed(
    value: Omit<t.pallet_nomination_pools.pallet.Event.Destroyed, "type">,
  ): t.pallet_nomination_pools.pallet.Event.Destroyed {
    return { type: "Destroyed", ...value }
  }
  /** The state of a pool has changed */
  export function StateChanged(
    value: Omit<t.pallet_nomination_pools.pallet.Event.StateChanged, "type">,
  ): t.pallet_nomination_pools.pallet.Event.StateChanged {
    return { type: "StateChanged", ...value }
  }
  /**
   * A member has been removed from a pool.
   *
   * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
   */
  export function MemberRemoved(
    value: Omit<t.pallet_nomination_pools.pallet.Event.MemberRemoved, "type">,
  ): t.pallet_nomination_pools.pallet.Event.MemberRemoved {
    return { type: "MemberRemoved", ...value }
  }
  /**
   * The roles of a pool have been updated to the given new roles. Note that the depositor
   * can never change.
   */
  export function RolesUpdated(
    value: Omit<t.pallet_nomination_pools.pallet.Event.RolesUpdated, "type">,
  ): t.pallet_nomination_pools.pallet.Event.RolesUpdated {
    return { type: "RolesUpdated", ...value }
  }
  /** The active balance of pool `pool_id` has been slashed to `balance`. */
  export function PoolSlashed(
    value: Omit<t.pallet_nomination_pools.pallet.Event.PoolSlashed, "type">,
  ): t.pallet_nomination_pools.pallet.Event.PoolSlashed {
    return { type: "PoolSlashed", ...value }
  }
  /** The unbond pool at `era` of pool `pool_id` has been slashed to `balance`. */
  export function UnbondingPoolSlashed(
    value: Omit<t.pallet_nomination_pools.pallet.Event.UnbondingPoolSlashed, "type">,
  ): t.pallet_nomination_pools.pallet.Event.UnbondingPoolSlashed {
    return { type: "UnbondingPoolSlashed", ...value }
  }
}
