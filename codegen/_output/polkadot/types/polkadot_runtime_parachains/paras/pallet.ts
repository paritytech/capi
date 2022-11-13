import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $call: $.Codec<types.polkadot_runtime_parachains.paras.pallet.Call> = _codec.$404

export const $error: $.Codec<types.polkadot_runtime_parachains.paras.pallet.Error> = _codec.$679

export const $event: $.Codec<types.polkadot_runtime_parachains.paras.pallet.Event> = _codec.$107

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_code
  | types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_head
  | types.polkadot_runtime_parachains.paras.pallet.Call.force_schedule_code_upgrade
  | types.polkadot_runtime_parachains.paras.pallet.Call.force_note_new_head
  | types.polkadot_runtime_parachains.paras.pallet.Call.force_queue_action
  | types.polkadot_runtime_parachains.paras.pallet.Call.add_trusted_validation_code
  | types.polkadot_runtime_parachains.paras.pallet.Call.poke_unused_validation_code
  | types.polkadot_runtime_parachains.paras.pallet.Call.include_pvf_check_statement
export namespace Call {
  /** Set the storage for the parachain validation code immediately. */
  export interface force_set_current_code {
    type: "force_set_current_code"
    para: types.polkadot_parachain.primitives.Id
    new_code: types.polkadot_parachain.primitives.ValidationCode
  }
  /** Set the storage for the current parachain head data immediately. */
  export interface force_set_current_head {
    type: "force_set_current_head"
    para: types.polkadot_parachain.primitives.Id
    new_head: types.polkadot_parachain.primitives.HeadData
  }
  /** Schedule an upgrade as if it was scheduled in the given relay parent block. */
  export interface force_schedule_code_upgrade {
    type: "force_schedule_code_upgrade"
    para: types.polkadot_parachain.primitives.Id
    new_code: types.polkadot_parachain.primitives.ValidationCode
    relay_parent_number: types.u32
  }
  /** Note a new block head for para within the context of the current block. */
  export interface force_note_new_head {
    type: "force_note_new_head"
    para: types.polkadot_parachain.primitives.Id
    new_head: types.polkadot_parachain.primitives.HeadData
  }
  /**
   * Put a parachain directly into the next session's action queue.
   * We can't queue it any sooner than this without going into the
   * initializer...
   */
  export interface force_queue_action {
    type: "force_queue_action"
    para: types.polkadot_parachain.primitives.Id
  }
  /**
   * Adds the validation code to the storage.
   *
   * The code will not be added if it is already present. Additionally, if PVF pre-checking
   * is running for that code, it will be instantly accepted.
   *
   * Otherwise, the code will be added into the storage. Note that the code will be added
   * into storage with reference count 0. This is to account the fact that there are no users
   * for this code yet. The caller will have to make sure that this code eventually gets
   * used by some parachain or removed from the storage to avoid storage leaks. For the latter
   * prefer to use the `poke_unused_validation_code` dispatchable to raw storage manipulation.
   *
   * This function is mainly meant to be used for upgrading parachains that do not follow
   * the go-ahead signal while the PVF pre-checking feature is enabled.
   */
  export interface add_trusted_validation_code {
    type: "add_trusted_validation_code"
    validation_code: types.polkadot_parachain.primitives.ValidationCode
  }
  /**
   * Remove the validation code from the storage iff the reference count is 0.
   *
   * This is better than removing the storage directly, because it will not remove the code
   * that was suddenly got used by some parachain while this dispatchable was pending
   * dispatching.
   */
  export interface poke_unused_validation_code {
    type: "poke_unused_validation_code"
    validation_code_hash: types.polkadot_parachain.primitives.ValidationCodeHash
  }
  /**
   * Includes a statement for a PVF pre-checking vote. Potentially, finalizes the vote and
   * enacts the results if that was the last vote before achieving the supermajority.
   */
  export interface include_pvf_check_statement {
    type: "include_pvf_check_statement"
    stmt: types.polkadot_primitives.v2.PvfCheckStatement
    signature: types.polkadot_primitives.v2.validator_app.Signature
  }
  /** Set the storage for the parachain validation code immediately. */
  export function force_set_current_code(
    value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_code, "type">,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_code {
    return { type: "force_set_current_code", ...value }
  }
  /** Set the storage for the current parachain head data immediately. */
  export function force_set_current_head(
    value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_head, "type">,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_head {
    return { type: "force_set_current_head", ...value }
  }
  /** Schedule an upgrade as if it was scheduled in the given relay parent block. */
  export function force_schedule_code_upgrade(
    value: Omit<
      types.polkadot_runtime_parachains.paras.pallet.Call.force_schedule_code_upgrade,
      "type"
    >,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.force_schedule_code_upgrade {
    return { type: "force_schedule_code_upgrade", ...value }
  }
  /** Note a new block head for para within the context of the current block. */
  export function force_note_new_head(
    value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_note_new_head, "type">,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.force_note_new_head {
    return { type: "force_note_new_head", ...value }
  }
  /**
   * Put a parachain directly into the next session's action queue.
   * We can't queue it any sooner than this without going into the
   * initializer...
   */
  export function force_queue_action(
    value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_queue_action, "type">,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.force_queue_action {
    return { type: "force_queue_action", ...value }
  }
  /**
   * Adds the validation code to the storage.
   *
   * The code will not be added if it is already present. Additionally, if PVF pre-checking
   * is running for that code, it will be instantly accepted.
   *
   * Otherwise, the code will be added into the storage. Note that the code will be added
   * into storage with reference count 0. This is to account the fact that there are no users
   * for this code yet. The caller will have to make sure that this code eventually gets
   * used by some parachain or removed from the storage to avoid storage leaks. For the latter
   * prefer to use the `poke_unused_validation_code` dispatchable to raw storage manipulation.
   *
   * This function is mainly meant to be used for upgrading parachains that do not follow
   * the go-ahead signal while the PVF pre-checking feature is enabled.
   */
  export function add_trusted_validation_code(
    value: Omit<
      types.polkadot_runtime_parachains.paras.pallet.Call.add_trusted_validation_code,
      "type"
    >,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.add_trusted_validation_code {
    return { type: "add_trusted_validation_code", ...value }
  }
  /**
   * Remove the validation code from the storage iff the reference count is 0.
   *
   * This is better than removing the storage directly, because it will not remove the code
   * that was suddenly got used by some parachain while this dispatchable was pending
   * dispatching.
   */
  export function poke_unused_validation_code(
    value: Omit<
      types.polkadot_runtime_parachains.paras.pallet.Call.poke_unused_validation_code,
      "type"
    >,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.poke_unused_validation_code {
    return { type: "poke_unused_validation_code", ...value }
  }
  /**
   * Includes a statement for a PVF pre-checking vote. Potentially, finalizes the vote and
   * enacts the results if that was the last vote before achieving the supermajority.
   */
  export function include_pvf_check_statement(
    value: Omit<
      types.polkadot_runtime_parachains.paras.pallet.Call.include_pvf_check_statement,
      "type"
    >,
  ): types.polkadot_runtime_parachains.paras.pallet.Call.include_pvf_check_statement {
    return { type: "include_pvf_check_statement", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "NotRegistered"
  | "CannotOnboard"
  | "CannotOffboard"
  | "CannotUpgrade"
  | "CannotDowngrade"
  | "PvfCheckStatementStale"
  | "PvfCheckStatementFuture"
  | "PvfCheckValidatorIndexOutOfBounds"
  | "PvfCheckInvalidSignature"
  | "PvfCheckDoubleVote"
  | "PvfCheckSubjectInvalid"
  | "PvfCheckDisabled"
  | "CannotUpgradeCode"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | types.polkadot_runtime_parachains.paras.pallet.Event.CurrentCodeUpdated
  | types.polkadot_runtime_parachains.paras.pallet.Event.CurrentHeadUpdated
  | types.polkadot_runtime_parachains.paras.pallet.Event.CodeUpgradeScheduled
  | types.polkadot_runtime_parachains.paras.pallet.Event.NewHeadNoted
  | types.polkadot_runtime_parachains.paras.pallet.Event.ActionQueued
  | types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckStarted
  | types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckAccepted
  | types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckRejected
export namespace Event {
  /** Current code has been updated for a Para. `para_id` */
  export interface CurrentCodeUpdated {
    type: "CurrentCodeUpdated"
    value: types.polkadot_parachain.primitives.Id
  }
  /** Current head has been updated for a Para. `para_id` */
  export interface CurrentHeadUpdated {
    type: "CurrentHeadUpdated"
    value: types.polkadot_parachain.primitives.Id
  }
  /** A code upgrade has been scheduled for a Para. `para_id` */
  export interface CodeUpgradeScheduled {
    type: "CodeUpgradeScheduled"
    value: types.polkadot_parachain.primitives.Id
  }
  /** A new head has been noted for a Para. `para_id` */
  export interface NewHeadNoted {
    type: "NewHeadNoted"
    value: types.polkadot_parachain.primitives.Id
  }
  /** A para has been queued to execute pending actions. `para_id` */
  export interface ActionQueued {
    type: "ActionQueued"
    value: [types.polkadot_parachain.primitives.Id, types.u32]
  }
  /**
   * The given para either initiated or subscribed to a PVF check for the given validation
   * code. `code_hash` `para_id`
   */
  export interface PvfCheckStarted {
    type: "PvfCheckStarted"
    value: [
      types.polkadot_parachain.primitives.ValidationCodeHash,
      types.polkadot_parachain.primitives.Id,
    ]
  }
  /**
   * The given validation code was accepted by the PVF pre-checking vote.
   * `code_hash` `para_id`
   */
  export interface PvfCheckAccepted {
    type: "PvfCheckAccepted"
    value: [
      types.polkadot_parachain.primitives.ValidationCodeHash,
      types.polkadot_parachain.primitives.Id,
    ]
  }
  /**
   * The given validation code was rejected by the PVF pre-checking vote.
   * `code_hash` `para_id`
   */
  export interface PvfCheckRejected {
    type: "PvfCheckRejected"
    value: [
      types.polkadot_parachain.primitives.ValidationCodeHash,
      types.polkadot_parachain.primitives.Id,
    ]
  }
  /** Current code has been updated for a Para. `para_id` */
  export function CurrentCodeUpdated(
    value: types.polkadot_runtime_parachains.paras.pallet.Event.CurrentCodeUpdated["value"],
  ): types.polkadot_runtime_parachains.paras.pallet.Event.CurrentCodeUpdated {
    return { type: "CurrentCodeUpdated", value }
  }
  /** Current head has been updated for a Para. `para_id` */
  export function CurrentHeadUpdated(
    value: types.polkadot_runtime_parachains.paras.pallet.Event.CurrentHeadUpdated["value"],
  ): types.polkadot_runtime_parachains.paras.pallet.Event.CurrentHeadUpdated {
    return { type: "CurrentHeadUpdated", value }
  }
  /** A code upgrade has been scheduled for a Para. `para_id` */
  export function CodeUpgradeScheduled(
    value: types.polkadot_runtime_parachains.paras.pallet.Event.CodeUpgradeScheduled["value"],
  ): types.polkadot_runtime_parachains.paras.pallet.Event.CodeUpgradeScheduled {
    return { type: "CodeUpgradeScheduled", value }
  }
  /** A new head has been noted for a Para. `para_id` */
  export function NewHeadNoted(
    value: types.polkadot_runtime_parachains.paras.pallet.Event.NewHeadNoted["value"],
  ): types.polkadot_runtime_parachains.paras.pallet.Event.NewHeadNoted {
    return { type: "NewHeadNoted", value }
  }
  /** A para has been queued to execute pending actions. `para_id` */
  export function ActionQueued(
    ...value: types.polkadot_runtime_parachains.paras.pallet.Event.ActionQueued["value"]
  ): types.polkadot_runtime_parachains.paras.pallet.Event.ActionQueued {
    return { type: "ActionQueued", value }
  }
  /**
   * The given para either initiated or subscribed to a PVF check for the given validation
   * code. `code_hash` `para_id`
   */
  export function PvfCheckStarted(
    ...value: types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckStarted["value"]
  ): types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckStarted {
    return { type: "PvfCheckStarted", value }
  }
  /**
   * The given validation code was accepted by the PVF pre-checking vote.
   * `code_hash` `para_id`
   */
  export function PvfCheckAccepted(
    ...value: types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckAccepted["value"]
  ): types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckAccepted {
    return { type: "PvfCheckAccepted", value }
  }
  /**
   * The given validation code was rejected by the PVF pre-checking vote.
   * `code_hash` `para_id`
   */
  export function PvfCheckRejected(
    ...value: types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckRejected["value"]
  ): types.polkadot_runtime_parachains.paras.pallet.Event.PvfCheckRejected {
    return { type: "PvfCheckRejected", value }
  }
}
