import * as U from "../../util/mod.ts";

export type TransactionStatus =
  | "future"
  | "ready"
  | "dropped"
  | "invalid"
  | {
    inBlock: U.HashHexString;
    broadcast?: never;
    retracted?: never;
    finalityTimeout?: never;
    finalized?: never;
    usurped?: never;
  }
  | {
    inBlock?: never;
    broadcast: string[];
    retracted?: never;
    finalityTimeout?: never;
    finalized?: never;
    usurped?: never;
  }
  | {
    inBlock?: never;
    broadcast?: never;
    retracted: U.HashHexString;
    finalityTimeout?: never;
    finalized?: never;
    usurped?: never;
  }
  | {
    inBlock?: never;
    broadcast?: never;
    retracted?: never;
    finalityTimeout: U.HashHexString;
    finalized?: never;
    usurped?: never;
  }
  | {
    inBlock?: never;
    broadcast?: never;
    retracted?: never;
    finalityTimeout: never;
    finalized: U.HashHexString;
    usurped?: never;
  }
  | {
    inBlock?: never;
    broadcast?: never;
    retracted?: never;
    finalityTimeout: never;
    finalized?: never;
    usurped: U.HashHexString;
  };
