import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = types.polkadot_runtime_parachains.ump.pallet.Call.service_overweight
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
    index: types.u64
    weight_limit: types.sp_weights.weight_v2.Weight
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
    value: Omit<types.polkadot_runtime_parachains.ump.pallet.Call.service_overweight, "type">,
  ): types.polkadot_runtime_parachains.ump.pallet.Call.service_overweight {
    return { type: "service_overweight", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error = "UnknownMessageIndex" | "WeightOverLimit"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.polkadot_runtime_parachains.ump.pallet.Event.InvalidFormat
  | types.polkadot_runtime_parachains.ump.pallet.Event.UnsupportedVersion
  | types.polkadot_runtime_parachains.ump.pallet.Event.ExecutedUpward
  | types.polkadot_runtime_parachains.ump.pallet.Event.WeightExhausted
  | types.polkadot_runtime_parachains.ump.pallet.Event.UpwardMessagesReceived
  | types.polkadot_runtime_parachains.ump.pallet.Event.OverweightEnqueued
  | types.polkadot_runtime_parachains.ump.pallet.Event.OverweightServiced
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
    value: [Uint8Array, types.xcm.v2.traits.Outcome]
  }
  /**
   * The weight limit for handling upward messages was reached.
   * \[ id, remaining, required \]
   */
  export interface WeightExhausted {
    type: "WeightExhausted"
    value: [Uint8Array, types.sp_weights.weight_v2.Weight, types.sp_weights.weight_v2.Weight]
  }
  /**
   * Some upward messages have been received and will be processed.
   * \[ para, count, size \]
   */
  export interface UpwardMessagesReceived {
    type: "UpwardMessagesReceived"
    value: [types.polkadot_parachain.primitives.Id, types.u32, types.u32]
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
      types.polkadot_parachain.primitives.Id,
      Uint8Array,
      types.u64,
      types.sp_weights.weight_v2.Weight,
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
    value: [types.u64, types.sp_weights.weight_v2.Weight]
  }
  /**
   * Upward message is invalid XCM.
   * \[ id \]
   */
  export function InvalidFormat(
    value: types.polkadot_runtime_parachains.ump.pallet.Event.InvalidFormat["value"],
  ): types.polkadot_runtime_parachains.ump.pallet.Event.InvalidFormat {
    return { type: "InvalidFormat", value }
  }
  /**
   * Upward message is unsupported version of XCM.
   * \[ id \]
   */
  export function UnsupportedVersion(
    value: types.polkadot_runtime_parachains.ump.pallet.Event.UnsupportedVersion["value"],
  ): types.polkadot_runtime_parachains.ump.pallet.Event.UnsupportedVersion {
    return { type: "UnsupportedVersion", value }
  }
  /**
   * Upward message executed with the given outcome.
   * \[ id, outcome \]
   */
  export function ExecutedUpward(
    ...value: types.polkadot_runtime_parachains.ump.pallet.Event.ExecutedUpward["value"]
  ): types.polkadot_runtime_parachains.ump.pallet.Event.ExecutedUpward {
    return { type: "ExecutedUpward", value }
  }
  /**
   * The weight limit for handling upward messages was reached.
   * \[ id, remaining, required \]
   */
  export function WeightExhausted(
    ...value: types.polkadot_runtime_parachains.ump.pallet.Event.WeightExhausted["value"]
  ): types.polkadot_runtime_parachains.ump.pallet.Event.WeightExhausted {
    return { type: "WeightExhausted", value }
  }
  /**
   * Some upward messages have been received and will be processed.
   * \[ para, count, size \]
   */
  export function UpwardMessagesReceived(
    ...value: types.polkadot_runtime_parachains.ump.pallet.Event.UpwardMessagesReceived["value"]
  ): types.polkadot_runtime_parachains.ump.pallet.Event.UpwardMessagesReceived {
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
    ...value: types.polkadot_runtime_parachains.ump.pallet.Event.OverweightEnqueued["value"]
  ): types.polkadot_runtime_parachains.ump.pallet.Event.OverweightEnqueued {
    return { type: "OverweightEnqueued", value }
  }
  /**
   * Upward message from the overweight queue was executed with the given actual weight
   * used.
   *
   * \[ overweight_index, used \]
   */
  export function OverweightServiced(
    ...value: types.polkadot_runtime_parachains.ump.pallet.Event.OverweightServiced["value"]
  ): types.polkadot_runtime_parachains.ump.pallet.Event.OverweightServiced {
    return { type: "OverweightServiced", value }
  }
}
