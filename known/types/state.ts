import * as U from "../../util/mod.ts";

export interface StorageNotification {
  block: U.HashHexString;
  // TODO: clean this up in accordance with https://github.com/paritytech/substrate/blob/0ba251c9388452c879bfcca425ada66f1f9bc802/client/api/src/notifications.rs#L55-L60
  changes: [U.HexString, U.HexString][];
}
