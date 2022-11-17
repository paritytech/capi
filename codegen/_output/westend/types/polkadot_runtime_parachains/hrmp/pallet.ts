import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpInitOpenChannel
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpAcceptOpenChannel
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCloseChannel
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.forceCleanHrmp
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.forceProcessHrmpOpen
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.forceProcessHrmpClose
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCancelOpenRequest
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.forceOpenHrmpChannel
export namespace Call {
  /**
   * Initiate opening a channel from a parachain to a given recipient with given channel
   * parameters.
   *
   * - `proposed_max_capacity` - specifies how many messages can be in the channel at once.
   * - `proposed_max_message_size` - specifies the maximum size of the messages.
   *
   * These numbers are a subject to the relay-chain configuration limits.
   *
   * The channel can be opened only after the recipient confirms it and only on a session
   * change.
   */
  export interface hrmpInitOpenChannel {
    type: "hrmpInitOpenChannel"
    recipient: types.polkadot_parachain.primitives.Id
    proposedMaxCapacity: types.u32
    proposedMaxMessageSize: types.u32
  }
  /**
   * Accept a pending open channel request from the given sender.
   *
   * The channel will be opened only on the next session boundary.
   */
  export interface hrmpAcceptOpenChannel {
    type: "hrmpAcceptOpenChannel"
    sender: types.polkadot_parachain.primitives.Id
  }
  /**
   * Initiate unilateral closing of a channel. The origin must be either the sender or the
   * recipient in the channel being closed.
   *
   * The closure can only happen on a session change.
   */
  export interface hrmpCloseChannel {
    type: "hrmpCloseChannel"
    channelId: types.polkadot_parachain.primitives.HrmpChannelId
  }
  /**
   * This extrinsic triggers the cleanup of all the HRMP storage items that
   * a para may have. Normally this happens once per session, but this allows
   * you to trigger the cleanup immediately for a specific parachain.
   *
   * Origin must be Root.
   *
   * Number of inbound and outbound channels for `para` must be provided as witness data of weighing.
   */
  export interface forceCleanHrmp {
    type: "forceCleanHrmp"
    para: types.polkadot_parachain.primitives.Id
    inbound: types.u32
    outbound: types.u32
  }
  /**
   * Force process HRMP open channel requests.
   *
   * If there are pending HRMP open channel requests, you can use this
   * function process all of those requests immediately.
   *
   * Total number of opening channels must be provided as witness data of weighing.
   */
  export interface forceProcessHrmpOpen {
    type: "forceProcessHrmpOpen"
    channels: types.u32
  }
  /**
   * Force process HRMP close channel requests.
   *
   * If there are pending HRMP close channel requests, you can use this
   * function process all of those requests immediately.
   *
   * Total number of closing channels must be provided as witness data of weighing.
   */
  export interface forceProcessHrmpClose {
    type: "forceProcessHrmpClose"
    channels: types.u32
  }
  /**
   * This cancels a pending open channel request. It can be canceled by either of the sender
   * or the recipient for that request. The origin must be either of those.
   *
   * The cancellation happens immediately. It is not possible to cancel the request if it is
   * already accepted.
   *
   * Total number of open requests (i.e. `HrmpOpenChannelRequestsList`) must be provided as
   * witness data.
   */
  export interface hrmpCancelOpenRequest {
    type: "hrmpCancelOpenRequest"
    channelId: types.polkadot_parachain.primitives.HrmpChannelId
    openRequests: types.u32
  }
  /**
   * Open a channel from a `sender` to a `recipient` `ParaId` using the Root origin. Although
   * opened by Root, the `max_capacity` and `max_message_size` are still subject to the Relay
   * Chain's configured limits.
   *
   * Expected use is when one of the `ParaId`s involved in the channel is governed by the
   * Relay Chain, e.g. a common good parachain.
   */
  export interface forceOpenHrmpChannel {
    type: "forceOpenHrmpChannel"
    sender: types.polkadot_parachain.primitives.Id
    recipient: types.polkadot_parachain.primitives.Id
    maxCapacity: types.u32
    maxMessageSize: types.u32
  }
  /**
   * Initiate opening a channel from a parachain to a given recipient with given channel
   * parameters.
   *
   * - `proposed_max_capacity` - specifies how many messages can be in the channel at once.
   * - `proposed_max_message_size` - specifies the maximum size of the messages.
   *
   * These numbers are a subject to the relay-chain configuration limits.
   *
   * The channel can be opened only after the recipient confirms it and only on a session
   * change.
   */
  export function hrmpInitOpenChannel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpInitOpenChannel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpInitOpenChannel {
    return { type: "hrmpInitOpenChannel", ...value }
  }
  /**
   * Accept a pending open channel request from the given sender.
   *
   * The channel will be opened only on the next session boundary.
   */
  export function hrmpAcceptOpenChannel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpAcceptOpenChannel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpAcceptOpenChannel {
    return { type: "hrmpAcceptOpenChannel", ...value }
  }
  /**
   * Initiate unilateral closing of a channel. The origin must be either the sender or the
   * recipient in the channel being closed.
   *
   * The closure can only happen on a session change.
   */
  export function hrmpCloseChannel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCloseChannel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCloseChannel {
    return { type: "hrmpCloseChannel", ...value }
  }
  /**
   * This extrinsic triggers the cleanup of all the HRMP storage items that
   * a para may have. Normally this happens once per session, but this allows
   * you to trigger the cleanup immediately for a specific parachain.
   *
   * Origin must be Root.
   *
   * Number of inbound and outbound channels for `para` must be provided as witness data of weighing.
   */
  export function forceCleanHrmp(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.forceCleanHrmp, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.forceCleanHrmp {
    return { type: "forceCleanHrmp", ...value }
  }
  /**
   * Force process HRMP open channel requests.
   *
   * If there are pending HRMP open channel requests, you can use this
   * function process all of those requests immediately.
   *
   * Total number of opening channels must be provided as witness data of weighing.
   */
  export function forceProcessHrmpOpen(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.forceProcessHrmpOpen, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.forceProcessHrmpOpen {
    return { type: "forceProcessHrmpOpen", ...value }
  }
  /**
   * Force process HRMP close channel requests.
   *
   * If there are pending HRMP close channel requests, you can use this
   * function process all of those requests immediately.
   *
   * Total number of closing channels must be provided as witness data of weighing.
   */
  export function forceProcessHrmpClose(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.forceProcessHrmpClose, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.forceProcessHrmpClose {
    return { type: "forceProcessHrmpClose", ...value }
  }
  /**
   * This cancels a pending open channel request. It can be canceled by either of the sender
   * or the recipient for that request. The origin must be either of those.
   *
   * The cancellation happens immediately. It is not possible to cancel the request if it is
   * already accepted.
   *
   * Total number of open requests (i.e. `HrmpOpenChannelRequestsList`) must be provided as
   * witness data.
   */
  export function hrmpCancelOpenRequest(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCancelOpenRequest, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCancelOpenRequest {
    return { type: "hrmpCancelOpenRequest", ...value }
  }
  /**
   * Open a channel from a `sender` to a `recipient` `ParaId` using the Root origin. Although
   * opened by Root, the `max_capacity` and `max_message_size` are still subject to the Relay
   * Chain's configured limits.
   *
   * Expected use is when one of the `ParaId`s involved in the channel is governed by the
   * Relay Chain, e.g. a common good parachain.
   */
  export function forceOpenHrmpChannel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.forceOpenHrmpChannel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.forceOpenHrmpChannel {
    return { type: "forceOpenHrmpChannel", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "OpenHrmpChannelToSelf"
  | "OpenHrmpChannelInvalidRecipient"
  | "OpenHrmpChannelZeroCapacity"
  | "OpenHrmpChannelCapacityExceedsLimit"
  | "OpenHrmpChannelZeroMessageSize"
  | "OpenHrmpChannelMessageSizeExceedsLimit"
  | "OpenHrmpChannelAlreadyExists"
  | "OpenHrmpChannelAlreadyRequested"
  | "OpenHrmpChannelLimitExceeded"
  | "AcceptHrmpChannelDoesntExist"
  | "AcceptHrmpChannelAlreadyConfirmed"
  | "AcceptHrmpChannelLimitExceeded"
  | "CloseHrmpChannelUnauthorized"
  | "CloseHrmpChannelDoesntExist"
  | "CloseHrmpChannelAlreadyUnderway"
  | "CancelHrmpOpenChannelUnauthorized"
  | "OpenHrmpChannelDoesntExist"
  | "OpenHrmpChannelAlreadyConfirmed"
  | "WrongWitness"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelRequested
  | types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelCanceled
  | types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelAccepted
  | types.polkadot_runtime_parachains.hrmp.pallet.Event.ChannelClosed
  | types.polkadot_runtime_parachains.hrmp.pallet.Event.HrmpChannelForceOpened
export namespace Event {
  /**
   * Open HRMP channel requested.
   * `[sender, recipient, proposed_max_capacity, proposed_max_message_size]`
   */
  export interface OpenChannelRequested {
    type: "OpenChannelRequested"
    value: [
      types.polkadot_parachain.primitives.Id,
      types.polkadot_parachain.primitives.Id,
      types.u32,
      types.u32,
    ]
  }
  /**
   * An HRMP channel request sent by the receiver was canceled by either party.
   * `[by_parachain, channel_id]`
   */
  export interface OpenChannelCanceled {
    type: "OpenChannelCanceled"
    value: [
      types.polkadot_parachain.primitives.Id,
      types.polkadot_parachain.primitives.HrmpChannelId,
    ]
  }
  /** Open HRMP channel accepted. `[sender, recipient]` */
  export interface OpenChannelAccepted {
    type: "OpenChannelAccepted"
    value: [types.polkadot_parachain.primitives.Id, types.polkadot_parachain.primitives.Id]
  }
  /** HRMP channel closed. `[by_parachain, channel_id]` */
  export interface ChannelClosed {
    type: "ChannelClosed"
    value: [
      types.polkadot_parachain.primitives.Id,
      types.polkadot_parachain.primitives.HrmpChannelId,
    ]
  }
  /**
   * An HRMP channel was opened via Root origin.
   * `[sender, recipient, proposed_max_capacity, proposed_max_message_size]`
   */
  export interface HrmpChannelForceOpened {
    type: "HrmpChannelForceOpened"
    value: [
      types.polkadot_parachain.primitives.Id,
      types.polkadot_parachain.primitives.Id,
      types.u32,
      types.u32,
    ]
  }
  /**
   * Open HRMP channel requested.
   * `[sender, recipient, proposed_max_capacity, proposed_max_message_size]`
   */
  export function OpenChannelRequested(
    ...value: types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelRequested["value"]
  ): types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelRequested {
    return { type: "OpenChannelRequested", value }
  }
  /**
   * An HRMP channel request sent by the receiver was canceled by either party.
   * `[by_parachain, channel_id]`
   */
  export function OpenChannelCanceled(
    ...value: types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelCanceled["value"]
  ): types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelCanceled {
    return { type: "OpenChannelCanceled", value }
  }
  /** Open HRMP channel accepted. `[sender, recipient]` */
  export function OpenChannelAccepted(
    ...value: types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelAccepted["value"]
  ): types.polkadot_runtime_parachains.hrmp.pallet.Event.OpenChannelAccepted {
    return { type: "OpenChannelAccepted", value }
  }
  /** HRMP channel closed. `[by_parachain, channel_id]` */
  export function ChannelClosed(
    ...value: types.polkadot_runtime_parachains.hrmp.pallet.Event.ChannelClosed["value"]
  ): types.polkadot_runtime_parachains.hrmp.pallet.Event.ChannelClosed {
    return { type: "ChannelClosed", value }
  }
  /**
   * An HRMP channel was opened via Root origin.
   * `[sender, recipient, proposed_max_capacity, proposed_max_message_size]`
   */
  export function HrmpChannelForceOpened(
    ...value: types.polkadot_runtime_parachains.hrmp.pallet.Event.HrmpChannelForceOpened["value"]
  ): types.polkadot_runtime_parachains.hrmp.pallet.Event.HrmpChannelForceOpened {
    return { type: "HrmpChannelForceOpened", value }
  }
}
