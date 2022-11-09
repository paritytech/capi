import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"

/**
 *  A mapping that stores the downward message queue MQC head for each para.
 *
 *  Each link in this chain has a form:
 *  `(prev_head, B, H(M))`, where
 *  - `prev_head`: is the previous head hash or zero if none.
 *  - `B`: is the relay-chain block number in which a message was appended.
 *  - `H(M)`: is the hash of the message being appended.
 */
export const DownwardMessageQueueHeads = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$11,
}

/** The downward messages addressed for a certain para. */
export const DownwardMessageQueues = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$682,
}
