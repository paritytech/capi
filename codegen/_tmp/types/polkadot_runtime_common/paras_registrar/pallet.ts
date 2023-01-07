import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $call: $.Codec<types.polkadot_runtime_common.paras_registrar.pallet.Call> = codecs.$410
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.polkadot_runtime_common.paras_registrar.pallet.Call.register
  | types.polkadot_runtime_common.paras_registrar.pallet.Call.forceRegister
  | types.polkadot_runtime_common.paras_registrar.pallet.Call.deregister
  | types.polkadot_runtime_common.paras_registrar.pallet.Call.swap
  | types.polkadot_runtime_common.paras_registrar.pallet.Call.forceRemoveLock
  | types.polkadot_runtime_common.paras_registrar.pallet.Call.reserve
export namespace Call {
  /**
   * Register head data and validation code for a reserved Para Id.
   *
   * ## Arguments
   * - `origin`: Must be called by a `Signed` origin.
   * - `id`: The para ID. Must be owned/managed by the `origin` signing account.
   * - `genesis_head`: The genesis head data of the parachain/thread.
   * - `validation_code`: The initial validation code of the parachain/thread.
   *
   * ## Deposits/Fees
   * The origin signed account must reserve a corresponding deposit for the registration. Anything already
   * reserved previously for this para ID is accounted for.
   *
   * ## Events
   * The `Registered` event is emitted in case of success.
   */
  export interface register {
    type: "register"
    id: types.polkadot_parachain.primitives.Id
    genesisHead: types.polkadot_parachain.primitives.HeadData
    validationCode: types.polkadot_parachain.primitives.ValidationCode
  }
  /**
   * Force the registration of a Para Id on the relay chain.
   *
   * This function must be called by a Root origin.
   *
   * The deposit taken can be specified for this registration. Any `ParaId`
   * can be registered, including sub-1000 IDs which are System Parachains.
   */
  export interface forceRegister {
    type: "forceRegister"
    who: types.sp_core.crypto.AccountId32
    deposit: types.u128
    id: types.polkadot_parachain.primitives.Id
    genesisHead: types.polkadot_parachain.primitives.HeadData
    validationCode: types.polkadot_parachain.primitives.ValidationCode
  }
  /**
   * Deregister a Para Id, freeing all data and returning any deposit.
   *
   * The caller must be Root, the `para` owner, or the `para` itself. The para must be a parathread.
   */
  export interface deregister {
    type: "deregister"
    id: types.polkadot_parachain.primitives.Id
  }
  /**
   * Swap a parachain with another parachain or parathread.
   *
   * The origin must be Root, the `para` owner, or the `para` itself.
   *
   * The swap will happen only if there is already an opposite swap pending. If there is not,
   * the swap will be stored in the pending swaps map, ready for a later confirmatory swap.
   *
   * The `ParaId`s remain mapped to the same head data and code so external code can rely on
   * `ParaId` to be a long-term identifier of a notional "parachain". However, their
   * scheduling info (i.e. whether they're a parathread or parachain), auction information
   * and the auction deposit are switched.
   */
  export interface swap {
    type: "swap"
    id: types.polkadot_parachain.primitives.Id
    other: types.polkadot_parachain.primitives.Id
  }
  /**
   * Remove a manager lock from a para. This will allow the manager of a
   * previously locked para to deregister or swap a para without using governance.
   *
   * Can only be called by the Root origin.
   */
  export interface forceRemoveLock {
    type: "forceRemoveLock"
    para: types.polkadot_parachain.primitives.Id
  }
  /**
   * Reserve a Para Id on the relay chain.
   *
   * This function will reserve a new Para Id to be owned/managed by the origin account.
   * The origin account is able to register head data and validation code using `register` to create
   * a parathread. Using the Slots pallet, a parathread can then be upgraded to get a parachain slot.
   *
   * ## Arguments
   * - `origin`: Must be called by a `Signed` origin. Becomes the manager/owner of the new para ID.
   *
   * ## Deposits/Fees
   * The origin must reserve a deposit of `ParaDeposit` for the registration.
   *
   * ## Events
   * The `Reserved` event is emitted in case of success, which provides the ID reserved for use.
   */
  export interface reserve {
    type: "reserve"
  }
  /**
   * Register head data and validation code for a reserved Para Id.
   *
   * ## Arguments
   * - `origin`: Must be called by a `Signed` origin.
   * - `id`: The para ID. Must be owned/managed by the `origin` signing account.
   * - `genesis_head`: The genesis head data of the parachain/thread.
   * - `validation_code`: The initial validation code of the parachain/thread.
   *
   * ## Deposits/Fees
   * The origin signed account must reserve a corresponding deposit for the registration. Anything already
   * reserved previously for this para ID is accounted for.
   *
   * ## Events
   * The `Registered` event is emitted in case of success.
   */
  export function register(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.register, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Call.register {
    return { type: "register", ...value }
  }
  /**
   * Force the registration of a Para Id on the relay chain.
   *
   * This function must be called by a Root origin.
   *
   * The deposit taken can be specified for this registration. Any `ParaId`
   * can be registered, including sub-1000 IDs which are System Parachains.
   */
  export function forceRegister(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.forceRegister, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Call.forceRegister {
    return { type: "forceRegister", ...value }
  }
  /**
   * Deregister a Para Id, freeing all data and returning any deposit.
   *
   * The caller must be Root, the `para` owner, or the `para` itself. The para must be a parathread.
   */
  export function deregister(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.deregister, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Call.deregister {
    return { type: "deregister", ...value }
  }
  /**
   * Swap a parachain with another parachain or parathread.
   *
   * The origin must be Root, the `para` owner, or the `para` itself.
   *
   * The swap will happen only if there is already an opposite swap pending. If there is not,
   * the swap will be stored in the pending swaps map, ready for a later confirmatory swap.
   *
   * The `ParaId`s remain mapped to the same head data and code so external code can rely on
   * `ParaId` to be a long-term identifier of a notional "parachain". However, their
   * scheduling info (i.e. whether they're a parathread or parachain), auction information
   * and the auction deposit are switched.
   */
  export function swap(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.swap, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Call.swap {
    return { type: "swap", ...value }
  }
  /**
   * Remove a manager lock from a para. This will allow the manager of a
   * previously locked para to deregister or swap a para without using governance.
   *
   * Can only be called by the Root origin.
   */
  export function forceRemoveLock(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.forceRemoveLock, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Call.forceRemoveLock {
    return { type: "forceRemoveLock", ...value }
  }
  /**
   * Reserve a Para Id on the relay chain.
   *
   * This function will reserve a new Para Id to be owned/managed by the origin account.
   * The origin account is able to register head data and validation code using `register` to create
   * a parathread. Using the Slots pallet, a parathread can then be upgraded to get a parachain slot.
   *
   * ## Arguments
   * - `origin`: Must be called by a `Signed` origin. Becomes the manager/owner of the new para ID.
   *
   * ## Deposits/Fees
   * The origin must reserve a deposit of `ParaDeposit` for the registration.
   *
   * ## Events
   * The `Reserved` event is emitted in case of success, which provides the ID reserved for use.
   */
  export function reserve(): types.polkadot_runtime_common.paras_registrar.pallet.Call.reserve {
    return { type: "reserve" }
  }
}

export const $error: $.Codec<types.polkadot_runtime_common.paras_registrar.pallet.Error> =
  codecs.$694
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "NotRegistered"
  | "AlreadyRegistered"
  | "NotOwner"
  | "CodeTooLarge"
  | "HeadDataTooLarge"
  | "NotParachain"
  | "NotParathread"
  | "CannotDeregister"
  | "CannotDowngrade"
  | "CannotUpgrade"
  | "ParaLocked"
  | "NotReserved"
  | "EmptyCode"
  | "CannotSwap"

export const $event: $.Codec<types.polkadot_runtime_common.paras_registrar.pallet.Event> =
  codecs.$116
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.polkadot_runtime_common.paras_registrar.pallet.Event.Registered
  | types.polkadot_runtime_common.paras_registrar.pallet.Event.Deregistered
  | types.polkadot_runtime_common.paras_registrar.pallet.Event.Reserved
export namespace Event {
  export interface Registered {
    type: "Registered"
    paraId: types.polkadot_parachain.primitives.Id
    manager: types.sp_core.crypto.AccountId32
  }
  export interface Deregistered {
    type: "Deregistered"
    paraId: types.polkadot_parachain.primitives.Id
  }
  export interface Reserved {
    type: "Reserved"
    paraId: types.polkadot_parachain.primitives.Id
    who: types.sp_core.crypto.AccountId32
  }
  export function Registered(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Event.Registered, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Event.Registered {
    return { type: "Registered", ...value }
  }
  export function Deregistered(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Event.Deregistered, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Event.Deregistered {
    return { type: "Deregistered", ...value }
  }
  export function Reserved(
    value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Event.Reserved, "type">,
  ): types.polkadot_runtime_common.paras_registrar.pallet.Event.Reserved {
    return { type: "Reserved", ...value }
  }
}
