import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.frame_system.pallet.Call.fillBlock
  | types.frame_system.pallet.Call.remark
  | types.frame_system.pallet.Call.setHeapPages
  | types.frame_system.pallet.Call.setCode
  | types.frame_system.pallet.Call.setCodeWithoutChecks
  | types.frame_system.pallet.Call.setStorage
  | types.frame_system.pallet.Call.killStorage
  | types.frame_system.pallet.Call.killPrefix
  | types.frame_system.pallet.Call.remarkWithEvent
export namespace Call {
  /** A dispatch that will fill the block weight up to the given ratio. */
  export interface fillBlock {
    type: "fillBlock"
    ratio: types.sp_arithmetic.per_things.Perbill
  }
  /**
   * Make some on-chain remark.
   *
   * # <weight>
   * - `O(1)`
   * # </weight>
   */
  export interface remark {
    type: "remark"
    remark: Uint8Array
  }
  /** Set the number of pages in the WebAssembly environment's heap. */
  export interface setHeapPages {
    type: "setHeapPages"
    pages: types.u64
  }
  /**
   * Set the new runtime code.
   *
   * # <weight>
   * - `O(C + S)` where `C` length of `code` and `S` complexity of `can_set_code`
   * - 1 call to `can_set_code`: `O(S)` (calls `sp_io::misc::runtime_version` which is
   *   expensive).
   * - 1 storage write (codec `O(C)`).
   * - 1 digest item.
   * - 1 event.
   * The weight of this function is dependent on the runtime, but generally this is very
   * expensive. We will treat this as a full block.
   * # </weight>
   */
  export interface setCode {
    type: "setCode"
    code: Uint8Array
  }
  /**
   * Set the new runtime code without doing any checks of the given `code`.
   *
   * # <weight>
   * - `O(C)` where `C` length of `code`
   * - 1 storage write (codec `O(C)`).
   * - 1 digest item.
   * - 1 event.
   * The weight of this function is dependent on the runtime. We will treat this as a full
   * block. # </weight>
   */
  export interface setCodeWithoutChecks {
    type: "setCodeWithoutChecks"
    code: Uint8Array
  }
  /** Set some items of storage. */
  export interface setStorage {
    type: "setStorage"
    items: Array<[Uint8Array, Uint8Array]>
  }
  /** Kill some items from storage. */
  export interface killStorage {
    type: "killStorage"
    keys: Array<Uint8Array>
  }
  /**
   * Kill all storage items with a key that starts with the given prefix.
   *
   * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
   * the prefix we are removing to accurately calculate the weight of this function.
   */
  export interface killPrefix {
    type: "killPrefix"
    prefix: Uint8Array
    subkeys: types.u32
  }
  /** Make some on-chain remark and emit event. */
  export interface remarkWithEvent {
    type: "remarkWithEvent"
    remark: Uint8Array
  }
  /** A dispatch that will fill the block weight up to the given ratio. */
  export function fillBlock(
    value: Omit<types.frame_system.pallet.Call.fillBlock, "type">,
  ): types.frame_system.pallet.Call.fillBlock {
    return { type: "fillBlock", ...value }
  }
  /**
   * Make some on-chain remark.
   *
   * # <weight>
   * - `O(1)`
   * # </weight>
   */
  export function remark(
    value: Omit<types.frame_system.pallet.Call.remark, "type">,
  ): types.frame_system.pallet.Call.remark {
    return { type: "remark", ...value }
  }
  /** Set the number of pages in the WebAssembly environment's heap. */
  export function setHeapPages(
    value: Omit<types.frame_system.pallet.Call.setHeapPages, "type">,
  ): types.frame_system.pallet.Call.setHeapPages {
    return { type: "setHeapPages", ...value }
  }
  /**
   * Set the new runtime code.
   *
   * # <weight>
   * - `O(C + S)` where `C` length of `code` and `S` complexity of `can_set_code`
   * - 1 call to `can_set_code`: `O(S)` (calls `sp_io::misc::runtime_version` which is
   *   expensive).
   * - 1 storage write (codec `O(C)`).
   * - 1 digest item.
   * - 1 event.
   * The weight of this function is dependent on the runtime, but generally this is very
   * expensive. We will treat this as a full block.
   * # </weight>
   */
  export function setCode(
    value: Omit<types.frame_system.pallet.Call.setCode, "type">,
  ): types.frame_system.pallet.Call.setCode {
    return { type: "setCode", ...value }
  }
  /**
   * Set the new runtime code without doing any checks of the given `code`.
   *
   * # <weight>
   * - `O(C)` where `C` length of `code`
   * - 1 storage write (codec `O(C)`).
   * - 1 digest item.
   * - 1 event.
   * The weight of this function is dependent on the runtime. We will treat this as a full
   * block. # </weight>
   */
  export function setCodeWithoutChecks(
    value: Omit<types.frame_system.pallet.Call.setCodeWithoutChecks, "type">,
  ): types.frame_system.pallet.Call.setCodeWithoutChecks {
    return { type: "setCodeWithoutChecks", ...value }
  }
  /** Set some items of storage. */
  export function setStorage(
    value: Omit<types.frame_system.pallet.Call.setStorage, "type">,
  ): types.frame_system.pallet.Call.setStorage {
    return { type: "setStorage", ...value }
  }
  /** Kill some items from storage. */
  export function killStorage(
    value: Omit<types.frame_system.pallet.Call.killStorage, "type">,
  ): types.frame_system.pallet.Call.killStorage {
    return { type: "killStorage", ...value }
  }
  /**
   * Kill all storage items with a key that starts with the given prefix.
   *
   * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
   * the prefix we are removing to accurately calculate the weight of this function.
   */
  export function killPrefix(
    value: Omit<types.frame_system.pallet.Call.killPrefix, "type">,
  ): types.frame_system.pallet.Call.killPrefix {
    return { type: "killPrefix", ...value }
  }
  /** Make some on-chain remark and emit event. */
  export function remarkWithEvent(
    value: Omit<types.frame_system.pallet.Call.remarkWithEvent, "type">,
  ): types.frame_system.pallet.Call.remarkWithEvent {
    return { type: "remarkWithEvent", ...value }
  }
}
/** Error for the System pallet */

export type Error =
  | "InvalidSpecName"
  | "SpecVersionNeedsToIncrease"
  | "FailedToExtractRuntimeVersion"
  | "NonDefaultComposite"
  | "NonZeroRefCount"
  | "CallFiltered"
/** Event for the System pallet. */

export type Event =
  | types.frame_system.pallet.Event.ExtrinsicSuccess
  | types.frame_system.pallet.Event.ExtrinsicFailed
  | types.frame_system.pallet.Event.CodeUpdated
  | types.frame_system.pallet.Event.NewAccount
  | types.frame_system.pallet.Event.KilledAccount
  | types.frame_system.pallet.Event.Remarked
export namespace Event {
  /** An extrinsic completed successfully. */
  export interface ExtrinsicSuccess {
    type: "ExtrinsicSuccess"
    dispatchInfo: types.frame_support.dispatch.DispatchInfo
  }
  /** An extrinsic failed. */
  export interface ExtrinsicFailed {
    type: "ExtrinsicFailed"
    dispatchError: types.sp_runtime.DispatchError
    dispatchInfo: types.frame_support.dispatch.DispatchInfo
  }
  /** `:code` was updated. */
  export interface CodeUpdated {
    type: "CodeUpdated"
  }
  /** A new account was created. */
  export interface NewAccount {
    type: "NewAccount"
    account: types.sp_core.crypto.AccountId32
  }
  /** An account was reaped. */
  export interface KilledAccount {
    type: "KilledAccount"
    account: types.sp_core.crypto.AccountId32
  }
  /** On on-chain remark happened. */
  export interface Remarked {
    type: "Remarked"
    sender: types.sp_core.crypto.AccountId32
    hash: types.primitive_types.H256
  }
  /** An extrinsic completed successfully. */
  export function ExtrinsicSuccess(
    value: Omit<types.frame_system.pallet.Event.ExtrinsicSuccess, "type">,
  ): types.frame_system.pallet.Event.ExtrinsicSuccess {
    return { type: "ExtrinsicSuccess", ...value }
  }
  /** An extrinsic failed. */
  export function ExtrinsicFailed(
    value: Omit<types.frame_system.pallet.Event.ExtrinsicFailed, "type">,
  ): types.frame_system.pallet.Event.ExtrinsicFailed {
    return { type: "ExtrinsicFailed", ...value }
  }
  /** `:code` was updated. */
  export function CodeUpdated(): types.frame_system.pallet.Event.CodeUpdated {
    return { type: "CodeUpdated" }
  }
  /** A new account was created. */
  export function NewAccount(
    value: Omit<types.frame_system.pallet.Event.NewAccount, "type">,
  ): types.frame_system.pallet.Event.NewAccount {
    return { type: "NewAccount", ...value }
  }
  /** An account was reaped. */
  export function KilledAccount(
    value: Omit<types.frame_system.pallet.Event.KilledAccount, "type">,
  ): types.frame_system.pallet.Event.KilledAccount {
    return { type: "KilledAccount", ...value }
  }
  /** On on-chain remark happened. */
  export function Remarked(
    value: Omit<types.frame_system.pallet.Event.Remarked, "type">,
  ): types.frame_system.pallet.Event.Remarked {
    return { type: "Remarked", ...value }
  }
}
