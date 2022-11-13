import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $call: $.Codec<types.frame_system.pallet.Call> = _codec.$161

export const $error: $.Codec<types.frame_system.pallet.Error> = _codec.$176

export const $event: $.Codec<types.frame_system.pallet.Event> = _codec.$20

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | types.frame_system.pallet.Call.fill_block
  | types.frame_system.pallet.Call.remark
  | types.frame_system.pallet.Call.set_heap_pages
  | types.frame_system.pallet.Call.set_code
  | types.frame_system.pallet.Call.set_code_without_checks
  | types.frame_system.pallet.Call.set_storage
  | types.frame_system.pallet.Call.kill_storage
  | types.frame_system.pallet.Call.kill_prefix
  | types.frame_system.pallet.Call.remark_with_event
export namespace Call {
  /** A dispatch that will fill the block weight up to the given ratio. */
  export interface fill_block {
    type: "fill_block"
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
  export interface set_heap_pages {
    type: "set_heap_pages"
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
  export interface set_code {
    type: "set_code"
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
  export interface set_code_without_checks {
    type: "set_code_without_checks"
    code: Uint8Array
  }
  /** Set some items of storage. */
  export interface set_storage {
    type: "set_storage"
    items: Array<[Uint8Array, Uint8Array]>
  }
  /** Kill some items from storage. */
  export interface kill_storage {
    type: "kill_storage"
    keys: Array<Uint8Array>
  }
  /**
   * Kill all storage items with a key that starts with the given prefix.
   *
   * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
   * the prefix we are removing to accurately calculate the weight of this function.
   */
  export interface kill_prefix {
    type: "kill_prefix"
    prefix: Uint8Array
    subkeys: types.u32
  }
  /** Make some on-chain remark and emit event. */
  export interface remark_with_event {
    type: "remark_with_event"
    remark: Uint8Array
  }
  /** A dispatch that will fill the block weight up to the given ratio. */
  export function fill_block(
    value: Omit<types.frame_system.pallet.Call.fill_block, "type">,
  ): types.frame_system.pallet.Call.fill_block {
    return { type: "fill_block", ...value }
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
  export function set_heap_pages(
    value: Omit<types.frame_system.pallet.Call.set_heap_pages, "type">,
  ): types.frame_system.pallet.Call.set_heap_pages {
    return { type: "set_heap_pages", ...value }
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
  export function set_code(
    value: Omit<types.frame_system.pallet.Call.set_code, "type">,
  ): types.frame_system.pallet.Call.set_code {
    return { type: "set_code", ...value }
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
  export function set_code_without_checks(
    value: Omit<types.frame_system.pallet.Call.set_code_without_checks, "type">,
  ): types.frame_system.pallet.Call.set_code_without_checks {
    return { type: "set_code_without_checks", ...value }
  }
  /** Set some items of storage. */
  export function set_storage(
    value: Omit<types.frame_system.pallet.Call.set_storage, "type">,
  ): types.frame_system.pallet.Call.set_storage {
    return { type: "set_storage", ...value }
  }
  /** Kill some items from storage. */
  export function kill_storage(
    value: Omit<types.frame_system.pallet.Call.kill_storage, "type">,
  ): types.frame_system.pallet.Call.kill_storage {
    return { type: "kill_storage", ...value }
  }
  /**
   * Kill all storage items with a key that starts with the given prefix.
   *
   * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
   * the prefix we are removing to accurately calculate the weight of this function.
   */
  export function kill_prefix(
    value: Omit<types.frame_system.pallet.Call.kill_prefix, "type">,
  ): types.frame_system.pallet.Call.kill_prefix {
    return { type: "kill_prefix", ...value }
  }
  /** Make some on-chain remark and emit event. */
  export function remark_with_event(
    value: Omit<types.frame_system.pallet.Call.remark_with_event, "type">,
  ): types.frame_system.pallet.Call.remark_with_event {
    return { type: "remark_with_event", ...value }
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
    dispatch_info: types.frame_support.dispatch.DispatchInfo
  }
  /** An extrinsic failed. */
  export interface ExtrinsicFailed {
    type: "ExtrinsicFailed"
    dispatch_error: types.sp_runtime.DispatchError
    dispatch_info: types.frame_support.dispatch.DispatchInfo
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
