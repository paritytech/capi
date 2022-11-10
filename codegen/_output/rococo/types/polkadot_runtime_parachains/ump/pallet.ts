import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $call: $.Codec<t.types.polkadot_runtime_parachains.ump.pallet.Call> = _codec.$408

export const $error: $.Codec<t.types.polkadot_runtime_parachains.ump.pallet.Error> = _codec.$685

export const $event: $.Codec<t.types.polkadot_runtime_parachains.ump.pallet.Event> = _codec.$108

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call = t.types.polkadot_runtime_parachains.ump.pallet.Call.service_overweight
export namespace Call {
  /**
   * Service a single overweight upward message.
   *
   * - `origin`: Must pass `ExecuteOverweightOrigin`.
   * - `index`: The index of the overweight message to service.
   * - `weight_limit`: The amount of weight that message execution may take.
   *
   * Errors:
   * - `UnknownMessageIndex`: Message of `index` is unknown.
   * - `WeightOverLimit`: Message execution may use greater than `weight_limit`.
   *
   * Events:
   * - `OverweightServiced`: On success.
   */
  export interface service_overweight {
    type: "service_overweight"
    index: t.types.u64
    weight_limit: t.types.sp_weights.weight_v2.Weight
  }
  /**
   * Service a single overweight upward message.
   *
   * - `origin`: Must pass `ExecuteOverweightOrigin`.
   * - `index`: The index of the overweight message to service.
   * - `weight_limit`: The amount of weight that message execution may take.
   *
   * Errors:
   * - `UnknownMessageIndex`: Message of `index` is unknown.
   * - `WeightOverLimit`: Message execution may use greater than `weight_limit`.
   *
   * Events:
   * - `OverweightServiced`: On success.
   */
  export function service_overweight(
    value: Omit<t.types.polkadot_runtime_parachains.ump.pallet.Call.service_overweight, "type">,
  ): t.types.polkadot_runtime_parachains.ump.pallet.Call.service_overweight {
    return { type: "service_overweight", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = "UnknownMessageIndex" | "WeightOverLimit"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.InvalidFormat
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.UnsupportedVersion
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.ExecutedUpward
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.WeightExhausted
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.UpwardMessagesReceived
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.OverweightEnqueued
  | t.types.polkadot_runtime_parachains.ump.pallet.Event.OverweightServiced
export namespace Event {
  /**
   * Upward message is invalid XCM.
   * \[ id \]
   */
  export interface InvalidFormat {
    type: "InvalidFormat"
    value: Uint8Array
  }
  /**
   * Upward message is unsupported version of XCM.
   * \[ id \]
   */
  export interface UnsupportedVersion {
    type: "UnsupportedVersion"
    value: Uint8Array
  }
  /**
   * Upward message executed with the given outcome.
   * \[ id, outcome \]
   */
  export interface ExecutedUpward {
    type: "ExecutedUpward"
    value: [Uint8Array, t.types.xcm.v2.traits.Outcome]
  }
  /**
   * The weight limit for handling upward messages was reached.
   * \[ id, remaining, required \]
   */
  export interface WeightExhausted {
    type: "WeightExhausted"
    value: [Uint8Array, t.types.sp_weights.weight_v2.Weight, t.types.sp_weights.weight_v2.Weight]
  }
  /**
   * Some upward messages have been received and will be processed.
   * \[ para, count, size \]
   */
  export interface UpwardMessagesReceived {
    type: "UpwardMessagesReceived"
    value: [t.types.polkadot_parachain.primitives.Id, t.types.u32, t.types.u32]
  }
  /**
   * The weight budget was exceeded for an individual upward message.
   *
   * This message can be later dispatched manually using `service_overweight` dispatchable
   * using the assigned `overweight_index`.
   *
   * \[ para, id, overweight_index, required \]
   */
  export interface OverweightEnqueued {
    type: "OverweightEnqueued"
    value: [
      t.types.polkadot_parachain.primitives.Id,
      Uint8Array,
      t.types.u64,
      t.types.sp_weights.weight_v2.Weight,
    ]
  }
  /**
   * Upward message from the overweight queue was executed with the given actual weight
   * used.
   *
   * \[ overweight_index, used \]
   */
  export interface OverweightServiced {
    type: "OverweightServiced"
    value: [t.types.u64, t.types.sp_weights.weight_v2.Weight]
  }
  /**
   * Upward message is invalid XCM.
   * \[ id \]
   */
  export function InvalidFormat(
    value: t.types.polkadot_runtime_parachains.ump.pallet.Event.InvalidFormat["value"],
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.InvalidFormat {
    return { type: "InvalidFormat", value }
  }
  /**
   * Upward message is unsupported version of XCM.
   * \[ id \]
   */
  export function UnsupportedVersion(
    value: t.types.polkadot_runtime_parachains.ump.pallet.Event.UnsupportedVersion["value"],
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.UnsupportedVersion {
    return { type: "UnsupportedVersion", value }
  }
  /**
   * Upward message executed with the given outcome.
   * \[ id, outcome \]
   */
  export function ExecutedUpward(
    ...value: t.types.polkadot_runtime_parachains.ump.pallet.Event.ExecutedUpward["value"]
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.ExecutedUpward {
    return { type: "ExecutedUpward", value }
  }
  /**
   * The weight limit for handling upward messages was reached.
   * \[ id, remaining, required \]
   */
  export function WeightExhausted(
    ...value: t.types.polkadot_runtime_parachains.ump.pallet.Event.WeightExhausted["value"]
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.WeightExhausted {
    return { type: "WeightExhausted", value }
  }
  /**
   * Some upward messages have been received and will be processed.
   * \[ para, count, size \]
   */
  export function UpwardMessagesReceived(
    ...value: t.types.polkadot_runtime_parachains.ump.pallet.Event.UpwardMessagesReceived["value"]
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.UpwardMessagesReceived {
    return { type: "UpwardMessagesReceived", value }
  }
  /**
   * The weight budget was exceeded for an individual upward message.
   *
   * This message can be later dispatched manually using `service_overweight` dispatchable
   * using the assigned `overweight_index`.
   *
   * \[ para, id, overweight_index, required \]
   */
  export function OverweightEnqueued(
    ...value: t.types.polkadot_runtime_parachains.ump.pallet.Event.OverweightEnqueued["value"]
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.OverweightEnqueued {
    return { type: "OverweightEnqueued", value }
  }
  /**
   * Upward message from the overweight queue was executed with the given actual weight
   * used.
   *
   * \[ overweight_index, used \]
   */
  export function OverweightServiced(
    ...value: t.types.polkadot_runtime_parachains.ump.pallet.Event.OverweightServiced["value"]
  ): t.types.polkadot_runtime_parachains.ump.pallet.Event.OverweightServiced {
    return { type: "OverweightServiced", value }
  }
}
