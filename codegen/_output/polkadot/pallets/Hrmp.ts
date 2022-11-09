import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  This mapping tracks how many open channel requests were accepted by a given recipient para.
 *  Invariant: `HrmpOpenChannelRequests` should contain the same number of items `(_, X)` with
 *  `confirmed` set to true, as the number of `HrmpAcceptedChannelRequestCount` for `X`.
 */
export const HrmpAcceptedChannelRequestCount = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$4,
}

/**
 *  Storage for the messages for each channel.
 *  Invariant: cannot be non-empty if the corresponding channel in `HrmpChannels` is `None`.
 */
export const HrmpChannelContents = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$112),
  value: _codec.$690,
}

/**
 *  Maintains a mapping that can be used to answer the question: What paras sent a message at
 *  the given block number for a given receiver. Invariants:
 *  - The inner `Vec<ParaId>` is never empty.
 *  - The inner `Vec<ParaId>` cannot store two same `ParaId`.
 *  - The outer vector is sorted ascending by block number and cannot store two items with the
 *    same block number.
 */
export const HrmpChannelDigests = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$692,
}

/**
 *  HRMP channel data associated with each para.
 *  Invariant:
 *  - each participant in the channel should satisfy `Paras::is_valid_para(P)` within a session.
 */
export const HrmpChannels = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$112),
  value: _codec.$688,
}

/**
 *  A set of pending HRMP close channel requests that are going to be closed during the session
 *  change. Used for checking if a given channel is registered for closure.
 *
 *  The set is accompanied by a list for iteration.
 *
 *  Invariant:
 *  - There are no channels that exists in list but not in the set and vice versa.
 */
export const HrmpCloseChannelRequests = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$112),
  value: _codec.$33,
}

export const HrmpCloseChannelRequestsList = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$687,
}

export const HrmpEgressChannelsIndex = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$662,
}

/**
 *  Ingress/egress indexes allow to find all the senders and receivers given the opposite side.
 *  I.e.
 *
 *  (a) ingress index allows to find all the senders for a given recipient.
 *  (b) egress index allows to find all the recipients for a given sender.
 *
 *  Invariants:
 *  - for each ingress index entry for `P` each item `I` in the index should present in
 *    `HrmpChannels` as `(I, P)`.
 *  - for each egress index entry for `P` each item `E` in the index should present in
 *    `HrmpChannels` as `(P, E)`.
 *  - there should be no other dangling channels in `HrmpChannels`.
 *  - the vectors are sorted.
 */
export const HrmpIngressChannelsIndex = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$662,
}

/**
 *  This mapping tracks how many open channel requests are initiated by a given sender para.
 *  Invariant: `HrmpOpenChannelRequests` should contain the same number of items that has
 *  `(X, _)` as the number of `HrmpOpenChannelRequestCount` for `X`.
 */
export const HrmpOpenChannelRequestCount = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$4,
}

/**
 *  The set of pending HRMP open channel requests.
 *
 *  The set is accompanied by a list for iteration.
 *
 *  Invariant:
 *  - There are no channels that exists in list but not in the set and vice versa.
 */
export const HrmpOpenChannelRequests = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$112),
  value: _codec.$686,
}

export const HrmpOpenChannelRequestsList = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$687,
}

/**
 *  The HRMP watermark associated with each para.
 *  Invariant:
 *  - each para `P` used here as a key should satisfy `Paras::is_valid_para(P)` within a session.
 */
export const HrmpWatermarks = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$4,
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
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.force_clean_hrmp, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "force_clean_hrmp" } }
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
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.force_open_hrmp_channel, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "force_open_hrmp_channel" } }
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
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_close, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "force_process_hrmp_close" } }
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
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_open, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "force_process_hrmp_open" } }
}

/**
 * Accept a pending open channel request from the given sender.
 *
 * The channel will be opened only on the next session boundary.
 */
export function hrmp_accept_open_channel(
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_accept_open_channel, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "hrmp_accept_open_channel" } }
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
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_cancel_open_request, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "hrmp_cancel_open_request" } }
}

/**
 * Initiate unilateral closing of a channel. The origin must be either the sender or the
 * recipient in the channel being closed.
 *
 * The closure can only happen on a session change.
 */
export function hrmp_close_channel(
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_close_channel, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "hrmp_close_channel" } }
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
  value: Omit<t.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_init_open_channel, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "hrmp_init_open_channel" } }
}
