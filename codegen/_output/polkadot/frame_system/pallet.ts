import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.frame_system.pallet.Call> = _codec.$161

export const $error: $.Codec<t.frame_system.pallet.Error> = _codec.$176

export const $event: $.Codec<t.frame_system.pallet.Event> = _codec.$20

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.frame_system.pallet.Call.fill_block
  | t.frame_system.pallet.Call.remark
  | t.frame_system.pallet.Call.set_heap_pages
  | t.frame_system.pallet.Call.set_code
  | t.frame_system.pallet.Call.set_code_without_checks
  | t.frame_system.pallet.Call.set_storage
  | t.frame_system.pallet.Call.kill_storage
  | t.frame_system.pallet.Call.kill_prefix
  | t.frame_system.pallet.Call.remark_with_event
export namespace Call {
  /** A dispatch that will fill the block weight up to the given ratio. */
  export interface fill_block {
    type: "fill_block"
    ratio: t.sp_arithmetic.per_things.Perbill
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
    pages: t.u64
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
    subkeys: t.u32
  }
  /** Make some on-chain remark and emit event. */
  export interface remark_with_event {
    type: "remark_with_event"
    remark: Uint8Array
  }
  /** A dispatch that will fill the block weight up to the given ratio. */
  export function fill_block(
    value: Omit<t.frame_system.pallet.Call.fill_block, "type">,
  ): t.frame_system.pallet.Call.fill_block {
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
    value: Omit<t.frame_system.pallet.Call.remark, "type">,
  ): t.frame_system.pallet.Call.remark {
    return { type: "remark", ...value }
  }
  /** Set the number of pages in the WebAssembly environment's heap. */
  export function set_heap_pages(
    value: Omit<t.frame_system.pallet.Call.set_heap_pages, "type">,
  ): t.frame_system.pallet.Call.set_heap_pages {
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
    value: Omit<t.frame_system.pallet.Call.set_code, "type">,
  ): t.frame_system.pallet.Call.set_code {
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
    value: Omit<t.frame_system.pallet.Call.set_code_without_checks, "type">,
  ): t.frame_system.pallet.Call.set_code_without_checks {
    return { type: "set_code_without_checks", ...value }
  }
  /** Set some items of storage. */
  export function set_storage(
    value: Omit<t.frame_system.pallet.Call.set_storage, "type">,
  ): t.frame_system.pallet.Call.set_storage {
    return { type: "set_storage", ...value }
  }
  /** Kill some items from storage. */
  export function kill_storage(
    value: Omit<t.frame_system.pallet.Call.kill_storage, "type">,
  ): t.frame_system.pallet.Call.kill_storage {
    return { type: "kill_storage", ...value }
  }
  /**
   * Kill all storage items with a key that starts with the given prefix.
   *
   * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
   * the prefix we are removing to accurately calculate the weight of this function.
   */
  export function kill_prefix(
    value: Omit<t.frame_system.pallet.Call.kill_prefix, "type">,
  ): t.frame_system.pallet.Call.kill_prefix {
    return { type: "kill_prefix", ...value }
  }
  /** Make some on-chain remark and emit event. */
  export function remark_with_event(
    value: Omit<t.frame_system.pallet.Call.remark_with_event, "type">,
  ): t.frame_system.pallet.Call.remark_with_event {
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
  | t.frame_system.pallet.Event.ExtrinsicSuccess
  | t.frame_system.pallet.Event.ExtrinsicFailed
  | t.frame_system.pallet.Event.CodeUpdated
  | t.frame_system.pallet.Event.NewAccount
  | t.frame_system.pallet.Event.KilledAccount
  | t.frame_system.pallet.Event.Remarked
export namespace Event {
  /** An extrinsic completed successfully. */
  export interface ExtrinsicSuccess {
    type: "ExtrinsicSuccess"
    dispatch_info: t.frame_support.dispatch.DispatchInfo
  }
  /** An extrinsic failed. */
  export interface ExtrinsicFailed {
    type: "ExtrinsicFailed"
    dispatch_error: t.sp_runtime.DispatchError
    dispatch_info: t.frame_support.dispatch.DispatchInfo
  }
  /** `:code` was updated. */
  export interface CodeUpdated {
    type: "CodeUpdated"
  }
  /** A new account was created. */
  export interface NewAccount {
    type: "NewAccount"
    account: t.sp_core.crypto.AccountId32
  }
  /** An account was reaped. */
  export interface KilledAccount {
    type: "KilledAccount"
    account: t.sp_core.crypto.AccountId32
  }
  /** On on-chain remark happened. */
  export interface Remarked {
    type: "Remarked"
    sender: t.sp_core.crypto.AccountId32
    hash: t.primitive_types.H256
  }
  /** An extrinsic completed successfully. */
  export function ExtrinsicSuccess(
    value: Omit<t.frame_system.pallet.Event.ExtrinsicSuccess, "type">,
  ): t.frame_system.pallet.Event.ExtrinsicSuccess {
    return { type: "ExtrinsicSuccess", ...value }
  }
  /** An extrinsic failed. */
  export function ExtrinsicFailed(
    value: Omit<t.frame_system.pallet.Event.ExtrinsicFailed, "type">,
  ): t.frame_system.pallet.Event.ExtrinsicFailed {
    return { type: "ExtrinsicFailed", ...value }
  }
  /** `:code` was updated. */
  export function CodeUpdated(): t.frame_system.pallet.Event.CodeUpdated {
    return { type: "CodeUpdated" }
  }
  /** A new account was created. */
  export function NewAccount(
    value: Omit<t.frame_system.pallet.Event.NewAccount, "type">,
  ): t.frame_system.pallet.Event.NewAccount {
    return { type: "NewAccount", ...value }
  }
  /** An account was reaped. */
  export function KilledAccount(
    value: Omit<t.frame_system.pallet.Event.KilledAccount, "type">,
  ): t.frame_system.pallet.Event.KilledAccount {
    return { type: "KilledAccount", ...value }
  }
  /** On on-chain remark happened. */
  export function Remarked(
    value: Omit<t.frame_system.pallet.Event.Remarked, "type">,
  ): t.frame_system.pallet.Event.Remarked {
    return { type: "Remarked", ...value }
  }
}
