import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

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
  $.tuple(codecs.$111),
  codecs.$678,
)

export const HrmpOpenChannelRequestsList = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Hrmp",
  "HrmpOpenChannelRequestsList",
  $.tuple(),
  codecs.$679,
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
  $.tuple(codecs.$97),
  codecs.$4,
)

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
  $.tuple(codecs.$97),
  codecs.$4,
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
  $.tuple(codecs.$111),
  codecs.$32,
)

export const HrmpCloseChannelRequestsList = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Hrmp",
  "HrmpCloseChannelRequestsList",
  $.tuple(),
  codecs.$679,
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
  $.tuple(codecs.$97),
  codecs.$4,
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
  $.tuple(codecs.$111),
  codecs.$680,
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
  $.tuple(codecs.$97),
  codecs.$654,
)

export const HrmpEgressChannelsIndex = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Hrmp",
  "HrmpEgressChannelsIndex",
  $.tuple(codecs.$97),
  codecs.$654,
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
  $.tuple(codecs.$111),
  codecs.$682,
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
  $.tuple(codecs.$97),
  codecs.$684,
)

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
) {
  return { type: "Hrmp", value: { ...value, type: "hrmpInitOpenChannel" } }
}

/**
 * Accept a pending open channel request from the given sender.
 *
 * The channel will be opened only on the next session boundary.
 */
export function hrmpAcceptOpenChannel(
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpAcceptOpenChannel, "type">,
) {
  return { type: "Hrmp", value: { ...value, type: "hrmpAcceptOpenChannel" } }
}

/**
 * Initiate unilateral closing of a channel. The origin must be either the sender or the
 * recipient in the channel being closed.
 *
 * The closure can only happen on a session change.
 */
export function hrmpCloseChannel(
  value: Omit<types.polkadot_runtime_parachains.hrmp.pallet.Call.hrmpCloseChannel, "type">,
) {
  return { type: "Hrmp", value: { ...value, type: "hrmpCloseChannel" } }
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
) {
  return { type: "Hrmp", value: { ...value, type: "forceCleanHrmp" } }
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
) {
  return { type: "Hrmp", value: { ...value, type: "forceProcessHrmpOpen" } }
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
) {
  return { type: "Hrmp", value: { ...value, type: "forceProcessHrmpClose" } }
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
) {
  return { type: "Hrmp", value: { ...value, type: "hrmpCancelOpenRequest" } }
}
