import * as known from "../known/rpc/mod.ts";
import * as U from "../util/mod.ts";
import { call, subscription } from "./effects.ts";

// TODO: generate the following?
export namespace state {
  export const getMetadata = call<[at?: U.Hash], U.Hex>("state_getMetadata");
  export const getStorage = call<[key: known.StorageKey, at?: U.Hash], known.StorageData>(
    "state_getStorage",
  );
  export const subscribeStorage = subscription<[keys: known.StorageKey[]], unknown>()(
    "state_subscribeStorage",
  );
  export const unsubscribeStorage = call<[subscriptionId: string], true>(
    "state_unsubscribeStorage",
  );
  export const getKeysPaged = call<
    [prefix: known.StorageKey, count: number, startKey?: known.StorageKey, at?: U.Hash],
    known.StorageKey[]
  >("state_getKeysPaged");
}
export namespace chain {
  export const subscribeNewHeads = subscription<[], known.Header>()("chain_subscribeNewHeads");
  export const unsubscribeNewHeads = call<[subscriptionId: string], true>(
    "chain_unsubscribeNewHeads",
  );
  export const getBlock = call<[hash?: U.Hash], known.Block>("chain_getBlock");
  export const getBlockHash = call<[height?: known.ListOrValue<known.NumberOrHex>], U.Hash>(
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
