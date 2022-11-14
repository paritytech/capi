import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  This mapping tracks how many open channel requests were accepted by a given recipient para.
 *  Invariant: `HrmpOpenChannelRequests` should contain the same number of items `(_, X)` with
 *  `confirmed` set to true, as the number of `HrmpAcceptedChannelRequestCount` for `X`.
 */
export const HrmpAcceptedChannelRequestCount = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpAcceptedChannelRequestCount",
  $.tuple(_codec.$98),
  _codec.$4,
)

/**
 *  Storage for the messages for each channel.
 *  Invariant: cannot be non-empty if the corresponding channel in `HrmpChannels` is `None`.
 */
export const HrmpChannelContents = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpChannelContents",
  $.tuple(_codec.$112),
  _codec.$690,
)

/**
 *  Maintains a mapping that can be used to answer the question: What paras sent a message at
 *  the given block number for a given receiver. Invariants:
 *  - The inner `Vec<ParaId>` is never empty.
 *  - The inner `Vec<ParaId>` cannot store two same `ParaId`.
 *  - The outer vector is sorted ascending by block number and cannot store two items with the
 *    same block number.
 */
export const HrmpChannelDigests = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpChannelDigests",
  $.tuple(_codec.$98),
  _codec.$692,
)

/**
 *  HRMP channel data associated with each para.
 *  Invariant:
 *  - each participant in the channel should satisfy `Paras::is_valid_para(P)` within a session.
 */
export const HrmpChannels = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Hrmp",
  "HrmpChannels",
  $.tuple(_codec.$112),
  _codec.$688,
)

/**
 *  A set of pending HRMP close channel requests that are going to be closed during the session
 *  change. Used for checking if a given channel is registered for closure.
 *
 *  The set is accompanied by a list for iteration.
 *
 *  Invariant:
 *  - There are no channels that exists in list but not in the set and vice versa.
 */
export const HrmpCloseChannelRequests = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Hrmp",
  "HrmpCloseChannelRequests",
  $.tuple(_codec.$112),
  _codec.$33,
)

export const HrmpCloseChannelRequestsList = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Hrmp",
  "HrmpCloseChannelRequestsList",
  $.tuple(),
  _codec.$687,
)

export const HrmpEgressChannelsIndex = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpEgressChannelsIndex",
  $.tuple(_codec.$98),
  _codec.$662,
)

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
export const HrmpIngressChannelsIndex = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpIngressChannelsIndex",
  $.tuple(_codec.$98),
  _codec.$662,
)

/**
 *  This mapping tracks how many open channel requests are initiated by a given sender para.
 *  Invariant: `HrmpOpenChannelRequests` should contain the same number of items that has
 *  `(X, _)` as the number of `HrmpOpenChannelRequestCount` for `X`.
 */
export const HrmpOpenChannelRequestCount = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpOpenChannelRequestCount",
  $.tuple(_codec.$98),
  _codec.$4,
)

/**
 *  The set of pending HRMP open channel requests.
 *
 *  The set is accompanied by a list for iteration.
 *
 *  Invariant:
 *  - There are no channels that exists in list but not in the set and vice versa.
 */
export const HrmpOpenChannelRequests = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Hrmp",
  "HrmpOpenChannelRequests",
  $.tuple(_codec.$112),
  _codec.$686,
)

export const HrmpOpenChannelRequestsList = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Hrmp",
  "HrmpOpenChannelRequestsList",
  $.tuple(),
  _codec.$687,
)

/**
 *  The HRMP watermark associated with each para.
 *  Invariant:
 *  - each para `P` used here as a key should satisfy `Paras::is_valid_para(P)` within a session.
 */
export const HrmpWatermarks = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Hrmp",
  "HrmpWatermarks",
  $.tuple(_codec.$98),
  _codec.$4,
)

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
): types.polkadot_runtime.RuntimeCall {
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
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.force_open_hrmp_channel, "type">,
): types.polkadot_runtime.RuntimeCall {
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
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_close, "type">,
): types.polkadot_runtime.RuntimeCall {
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
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.force_process_hrmp_open, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "force_process_hrmp_open" } }
}

/**
 * Accept a pending open channel request from the given sender.
 *
 * The channel will be opened only on the next session boundary.
 */
export function hrmp_accept_open_channel(
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_accept_open_channel, "type">,
): types.polkadot_runtime.RuntimeCall {
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
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_cancel_open_request, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "hrmp_cancel_open_request" } }
}

/**
 * Initiate unilateral closing of a channel. The origin must be either the sender or the
 * recipient in the channel being closed.
 *
 * The closure can only happen on a session change.
 */
export function hrmp_close_channel(
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_close_channel, "type">,
): types.polkadot_runtime.RuntimeCall {
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
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmp_init_open_channel, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Hrmp", value: { ...value, type: "hrmp_init_open_channel" } }
}
