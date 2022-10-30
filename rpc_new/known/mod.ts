// TODO: bring `known/rpc` into `rpc_new`

import * as known from "../../known/rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { call, subscription } from "../narrow.ts";

export const methods = call("rpc_methods");

export namespace state {
  export function getMetadata(blockHash?: string) {
    return call<U.Hex>("state_getMetadata", blockHash);
  }
  export function getStorage(key: U.Hex<Uint8Array>, blockHash?: U.HexHash) {
    return call<U.Hex>("state_getStorage", key, blockHash);
  }
  export function subscribeStorage(key: U.Hex<Uint8Array>) {
    return subscription<known.StorageChangeSet>()("state_subscribeStorage", key);
  }
  export function unsubscribeStorage(subscriptionId: string) {
    return call<void>("state_unsubscribeStorage", subscriptionId);
  }
  export function getRuntimeVersion() {
    return call<known.RuntimeVersion>("state_getRuntimeVersion");
  }
  export function getKeysPaged(key: U.Hex, count: number, startKey: U.Hex, blockHash: U.HexHash) {
    return call<known.StorageKey[]>("state_getKeysPaged", key, count, startKey, blockHash);
  }
}

export namespace chain {
  export const subscribeNewHeads = subscription<known.Header>()("chain_subscribeNewHeads");
  export function unsubscribeNewHead(subscriptionId: number) {
    return call<void>("chain_unsubscribeNewHead", subscriptionId);
  }
  export const subscribeAllHeads = subscription<known.Header>()("chain_subscribeAllHeads");
  export function unsubscribeAllHeads(subscriptionId: string) {
    return call<void>("chain_unsubscribeAllHeads", subscriptionId);
  }
  export function getBlock(blockHash?: U.HexHash) {
    return call<known.SignedBlock>("chain_getBlock", blockHash);
  }
  export function getBlockHash(height?: known.ListOrValue<known.NumberOrHex>) {
    return call<known.ListOrValue<U.Hash>>("chain_getBlockHash", height);
  }
}

export namespace author {
  export function submitExtrinsic(extrinsic: U.Hex) {
    return call<U.Hex>("author_submitExtrinsic", extrinsic);
  }
  export function submitAndWatchExtrinsic(extrinsic: U.Hex) {
    return subscription<known.TransactionStatus>()("author_submitAndWatchExtrinsic", extrinsic);
  }
  export function unwatchExtrinsic(subscriptionId: string) {
    return call<void>("author_unwatchExtrinsic", subscriptionId);
  }
}

export namespace system {
  export function accountNextIndex(address: string) {
    return call<number>("system_accountNextIndex", address);
  }
}
