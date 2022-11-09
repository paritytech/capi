import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { rpcCall, rpcSubscription } from "./rpc.ts";

// TODO: generate the following?
export namespace state {
  export const getMetadata = rpcCall<[at?: U.HexHash], U.HexHash>("state_getMetadata");
  export const getStorage = rpcCall<
    [key: known.StorageKey, at?: U.HexHash],
    known.StorageData
  >("state_getStorage", true);
  export const subscribeStorage = rpcSubscription<
    [keys: known.StorageKey[]],
    known.StorageChangeSet
  >()(
    "state_subscribeStorage",
  );
  export const unsubscribeStorage = rpcCall<[subscriptionId: string], true>(
    "state_unsubscribeStorage",
  );
  export const getKeysPaged = rpcCall<
    [prefix: known.StorageKey, count: number, startKey?: known.StorageKey, at?: U.HexHash],
    known.StorageKey[]
  >("state_getKeysPaged");
}
export namespace chain {
  export const subscribeNewHeads = rpcSubscription<[], known.Header>()("chain_subscribeNewHeads");
  export const unsubscribeNewHeads = rpcCall<[subscriptionId: string], true>(
    "chain_unsubscribeNewHeads",
  );
  export const getBlock = rpcCall<[hash?: U.HexHash], known.SignedBlock>("chain_getBlock");
  export const getBlockHash = rpcCall<[height?: known.ListOrValue<known.NumberOrHex>], U.HexHash>(
    "chain_getBlockHash",
  );
}
export namespace system {
  export const accountNextIndex = rpcCall<[accountId: known.AccountId], number>(
    "system_accountNextIndex",
  );
}
export namespace author {
  export const submitAndWatchExtrinsic = rpcSubscription<
    [extrinsic: U.Hex],
    known.TransactionStatus
  >()("author_submitAndWatchExtrinsic");
  export const unwatchExtrinsic = rpcCall<[subscriptionId: string], true>(
    "author_unwatchExtrinsic",
  );
  export const submitExtrinsic = rpcCall<[extrinsic: U.Hex], U.Hash>("author_submitExtrinsic");
}
export const methods = rpcCall<[], string[]>("rpc_methods");
