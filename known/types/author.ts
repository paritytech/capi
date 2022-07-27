import * as U from "../../util/mod.ts";

export type TransactionStatus =
  | "future"
  | "ready"
  | "dropped"
  | "invalid"
  | { inBlock: U.HashHexString }
  | { broadcast: string[] }
  | { retracted: U.HashHexString }
  | { finalityTimeout: U.HashHexString }
  | { finalized: U.HashHexString }
  | { usurped: U.HashHexString };
