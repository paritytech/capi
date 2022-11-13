import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Storage for bonded pools. */
export const BondedPools = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$622,
}

/** Counter for the related counted storage map */
export const CounterForBondedPools = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Counter for the related counted storage map */
export const CounterForMetadata = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Counter for the related counted storage map */
export const CounterForPoolMembers = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Counter for the related counted storage map */
export const CounterForReversePoolIdLookup = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Counter for the related counted storage map */
export const CounterForRewardPools = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Counter for the related counted storage map */
export const CounterForSubPoolsStorage = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Ever increasing number of all pools created so far. */
export const LastPoolId = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Maximum number of members that can exist in the system. If `None`, then the count
 *  members are not bound on a system wide basis.
 */
export const MaxPoolMembers = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Maximum number of members that may belong to pool. If `None`, then the count of
 *  members is not bound on a per pool basis.
 */
export const MaxPoolMembersPerPool = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Maximum number of nomination pools that can exist. If `None`, then an unbounded number of
 *  pools can exist.
 */
export const MaxPools = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Metadata for the pool. */
export const Metadata = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$631,
}

/**
 *  Minimum bond required to create a pool.
 *
 *  This is the amount that the depositor must put as their initial stake in the pool, as an
 *  indication of "skin in the game".
 *
 *  This is the value that will always exist in the staking ledger of the pool bonded account
 *  while all other accounts leave.
 */
export const MinCreateBond = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$6,
}

/** Minimum amount to bond to join a pool. */
export const MinJoinBond = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$6,
}

/** Active members. */
export const PoolMembers = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$617,
}

/**
 *  A reverse lookup from the pool's account id to its id.
 *
 *  This is only used for slashing. In all other instances, the pool id is used, and the
 *  accounts are deterministically derived from it.
 */
export const ReversePoolIdLookup = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$4,
}

/**
 *  Reward pools. This is where there rewards for each pool accumulate. When a members payout
 *  is claimed, the balance comes out fo the reward pool. Keyed by the bonded pools account.
 */
export const RewardPools = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$624,
}

/**
 *  Groups of unbonding pools. Each group of unbonding pools belongs to a bonded pool,
 *  hence the name sub-pools. Keyed by the bonded pools account.
 */
export const SubPoolsStorage = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$625,
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "bond_extra" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "chill" } }
}

/**
 * A bonded member can use this to claim their payout based on the rewards that the pool
 * has accumulated since their last claimed payout (OR since joining if this is there first
 * time claiming rewards). The payout will be transferred to the member's account.
 *
 * The member will earn rewards pro rata based on the members stake vs the sum of the
 * members in the pools stake. Rewards do not "expire".
 */
export function claim_payout(): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { type: "claim_payout" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "create" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "join" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "nominate" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "pool_withdraw_unbonded" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "set_configs" } }
}

/**
 * Set a new metadata for the pool.
 *
 * The dispatch origin of this call must be signed by the state toggler, or the root role
 * of the pool.
 */
export function set_metadata(
  value: Omit<types.pallet_nomination_pools.pallet.Call.set_metadata, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "set_metadata" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "set_state" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "unbond" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "update_roles" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "NominationPools", value: { ...value, type: "withdraw_unbonded" } }
}
