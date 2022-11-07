import * as known from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { call } from "./call.ts";
import { subscription } from "./subscription.ts";

// TODO: generate the following?
export namespace state {
  export const getMetadata = call<[at?: U.HexHash], U.HexHash>("state_getMetadata");
  export const getStorage = call<
    [key: known.StorageKey, at?: U.HexHash],
    known.StorageData
  >("state_getStorage", true);
  export const subscribeStorage = subscription<
    [keys: known.StorageKey[]],
    known.StorageChangeSet
  >()(
    "state_subscribeStorage",
  );
  export const unsubscribeStorage = call<[subscriptionId: string], true>(
    "state_unsubscribeStorage",
  );
  export const getKeysPaged = call<
    [prefix: known.StorageKey, count: number, startKey?: known.StorageKey, at?: U.HexHash],
    known.StorageKey[]
  >("state_getKeysPaged");
}
export namespace chain {
  export const subscribeNewHeads = subscription<[], known.Header>()("chain_subscribeNewHeads");
  export const unsubscribeNewHeads = call<[subscriptionId: string], true>(
    "chain_unsubscribeNewHeads",
  );
  export const getBlock = call<[hash?: U.HexHash], known.SignedBlock>("chain_getBlock");
  export const getBlockHash = call<[height?: known.ListOrValue<known.NumberOrHex>], U.HexHash>(
    "chain_getBlockHash",
  );
}
export namespace system {
  export const accountNextIndex = call<[accountId: known.AccountId], number>(
    "system_accountNextIndex",
  );
}
export namespace author {
  export const submitAndWatchExtrinsic = subscription<
    [extrinsic: U.Hex],
    known.TransactionStatus
  >()("author_submitAndWatchExtrinsic");
  export const unwatchExtrinsic = call<[subscriptionId: string], true>("author_unwatchExtrinsic");
  export const submitExtrinsic = call<[extrinsic: U.Hex], U.Hash>("author_submitExtrinsic");
}
export const methods = call<[], string[]>("rpc_methods");
