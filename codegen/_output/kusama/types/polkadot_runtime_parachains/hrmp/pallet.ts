import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_init_open_channel
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_accept_open_channel
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_close_channel
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.force_clean_hrmp
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_open
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_close
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_cancel_open_request
  | types.polkadot_runtime_parachains.hrmp.pallet.Call.force_open_hrmp_channel
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
  export interface hrmp_init_open_channel {
    type: "hrmp_init_open_channel"
    recipient: types.polkadot_parachain.primitives.Id
    proposed_max_capacity: types.u32
    proposed_max_message_size: types.u32
  }
  /**
   * Accept a pending open channel request from the given sender.
   *
   * The channel will be opened only on the next session boundary.
   */
  export interface hrmp_accept_open_channel {
    type: "hrmp_accept_open_channel"
    sender: types.polkadot_parachain.primitives.Id
  }
  /**
   * Initiate unilateral closing of a channel. The origin must be either the sender or the
   * recipient in the channel being closed.
   *
   * The closure can only happen on a session change.
   */
  export interface hrmp_close_channel {
    type: "hrmp_close_channel"
    channel_id: types.polkadot_parachain.primitives.HrmpChannelId
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
  export interface force_clean_hrmp {
    type: "force_clean_hrmp"
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
  export interface force_process_hrmp_open {
    type: "force_process_hrmp_open"
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
  export interface force_process_hrmp_close {
    type: "force_process_hrmp_close"
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
  export interface hrmp_cancel_open_request {
    type: "hrmp_cancel_open_request"
    channel_id: types.polkadot_parachain.primitives.HrmpChannelId
    open_requests: types.u32
  }
  /**
   * Open a channel from a `sender` to a `recipient` `ParaId` using the Root origin. Although
   * opened by Root, the `max_capacity` and `max_message_size` are still subject to the Relay
   * Chain's configured limits.
   *
   * Expected use is when one of the `ParaId`s involved in the channel is governed by the
   * Relay Chain, e.g. a common good parachain.
   */
  export interface force_open_hrmp_channel {
    type: "force_open_hrmp_channel"
    sender: types.polkadot_parachain.primitives.Id
    recipient: types.polkadot_parachain.primitives.Id
    max_capacity: types.u32
    max_message_size: types.u32
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
  export function hrmp_init_open_channel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_init_open_channel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_init_open_channel {
    return { type: "hrmp_init_open_channel", ...value }
  }
  /**
   * Accept a pending open channel request from the given sender.
   *
   * The channel will be opened only on the next session boundary.
   */
  export function hrmp_accept_open_channel(
    value: Omit<
      types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_accept_open_channel,
      "type"
    >,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_accept_open_channel {
    return { type: "hrmp_accept_open_channel", ...value }
  }
  /**
   * Initiate unilateral closing of a channel. The origin must be either the sender or the
   * recipient in the channel being closed.
   *
   * The closure can only happen on a session change.
   */
  export function hrmp_close_channel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_close_channel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_close_channel {
    return { type: "hrmp_close_channel", ...value }
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
  export function force_clean_hrmp(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.force_clean_hrmp, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.force_clean_hrmp {
    return { type: "force_clean_hrmp", ...value }
  }
  /**
   * Force process HRMP open channel requests.
   *
   * If there are pending HRMP open channel requests, you can use this
   * function process all of those requests immediately.
   *
   * Total number of opening channels must be provided as witness data of weighing.
   */
  export function force_process_hrmp_open(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_open, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_open {
    return { type: "force_process_hrmp_open", ...value }
  }
  /**
   * Force process HRMP close channel requests.
   *
   * If there are pending HRMP close channel requests, you can use this
   * function process all of those requests immediately.
   *
   * Total number of closing channels must be provided as witness data of weighing.
   */
  export function force_process_hrmp_close(
    value: Omit<
      types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_close,
      "type"
    >,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_close {
    return { type: "force_process_hrmp_close", ...value }
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
  export function hrmp_cancel_open_request(
    value: Omit<
      types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_cancel_open_request,
      "type"
    >,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_cancel_open_request {
    return { type: "hrmp_cancel_open_request", ...value }
  }
  /**
   * Open a channel from a `sender` to a `recipient` `ParaId` using the Root origin. Although
   * opened by Root, the `max_capacity` and `max_message_size` are still subject to the Relay
   * Chain's configured limits.
   *
   * Expected use is when one of the `ParaId`s involved in the channel is governed by the
   * Relay Chain, e.g. a common good parachain.
   */
  export function force_open_hrmp_channel(
    value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.force_open_hrmp_channel, "type">,
  ): types.polkadot_runtime_parachains.hrmp.pallet.Call.force_open_hrmp_channel {
    return { type: "force_open_hrmp_channel", ...value }
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
