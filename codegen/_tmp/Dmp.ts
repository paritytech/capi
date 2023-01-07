import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The downward messages addressed for a certain para. */
export const DownwardMessageQueues = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Dmp",
  "DownwardMessageQueues",
  $.tuple(codecs.$97),
  codecs.$674,
)

/**
 *  A mapping that stores the downward message queue MQC head for each para.
 *
 *  Each link in this chain has a form:
 *  `(prev_head, B, H(M))`, where
 *  - `prev_head`: is the previous head hash or zero if none.
 *  - `B`: is the relay-chain block number in which a message was appended.
 *  - `H(M)`: is the hash of the message being appended.
 */
export const DownwardMessageQueueHeads = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Dmp",
  "DownwardMessageQueueHeads",
  $.tuple(codecs.$97),
  codecs.$10,
)
