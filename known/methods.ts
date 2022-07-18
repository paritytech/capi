import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import * as T from "./types/mod.ts";

export type TODO_NARROW_METHOD_TYPE = [any[], any];

// TODO: attach type-level docs (draw from Substrate's source)
export interface KnownRpcMethods extends
  EnsureKnownMethods<{
    account: {
      nextIndex: TODO_NARROW_METHOD_TYPE;
    };
    author: {
      hasKey: [[pubKey: string, keyType: string], string];
      hasSessionKeys: TODO_NARROW_METHOD_TYPE;
      insertKey: TODO_NARROW_METHOD_TYPE;
      pendingExtrinsics: TODO_NARROW_METHOD_TYPE;
      removeExtrinsics: TODO_NARROW_METHOD_TYPE;
      rotateKeys: TODO_NARROW_METHOD_TYPE;
      submitAndWatchExtrinsic: [[tx: string], rpc.Subscription<unknown>];
      submitExtrinsic: [[transaction: U.HexString], U.HashHexString];
      unwatchExtrinsic: [[subscriptionId: U.SubscriptionIdString], unknown];
    };
    babe: {
      epochAuthorship: TODO_NARROW_METHOD_TYPE;
    };
    chain: {
      getBlock: [[hash?: U.HashHexString], T.Block];
      getBlockHash: [[height?: number], U.HashHexString];
      getFinalisedHead: KnownRpcMethods["chain_getFinalizedHead"];
      getFinalizedHead: [[], U.HashHexString];
      getHead: KnownRpcMethods["chain_getBlockHash"];
      getHeader: [[hash?: U.HashHexString], T.Header];
      getRuntimeVersion: KnownRpcMethods["state_getRuntimeVersion"];
      subscribeAllHeads: [[], rpc.Subscription<T.Header>];
      subscribeFinalisedHeads: KnownRpcMethods["chain_subscribeFinalizedHeads"];
      subscribeFinalizedHeads: [[], rpc.Subscription<T.Header /* TODO: narrow to finalized? */>];
      subscribeNewHead: KnownRpcMethods["chain_subscribeNewHeads"];
      subscribeNewHeads: [[], rpc.Subscription<unknown>];
      subscribeRuntimeVersion: KnownRpcMethods["state_subscribeRuntimeVersion"];
      subscribe_newHead: KnownRpcMethods["chain_subscribeNewHeads"];
      unsubscribeAllHeads: [[subscription: string], boolean];
      unsubscribeFinalisedHeads: KnownRpcMethods["chain_unsubscribeFinalizedHeads"];
      unsubscribeFinalizedHeads: [[subscription: string], boolean];
      unsubscribeNewHead: KnownRpcMethods["chain_unsubscribeNewHeads"];
      unsubscribeNewHeads: [[subscription: string], boolean];
      unsubscribeRuntimeVersion: KnownRpcMethods["state_unsubscribeRuntimeVersion"];
      unsubscribe_newHead: KnownRpcMethods["chain_unsubscribeNewHeads"];
    };
    chainHead: {
      unstable_body: [
        [followSubscription: U.HashHexString, networkConfig?: T.NetworkConfig],
        string,
      ];
      unstable_call: [[
        hash: U.HashHexString | undefined,
        fn: string,
        callParameters: U.HexString,
        networkConfig?: T.NetworkConfig,
      ], string];
      unstable_follow: [
        [runtimeUpdates: boolean],
        rpc.Subscription<T.ChainHeadUnstableFollowEvent>,
      ];
      unstable_genesisHash: [[], U.HashHexString];
      unstable_header: [
        [followSubscription: string, hash: U.HashHexString],
        U.HexString | undefined,
      ];
      unstable_stopBody: [[subscription: string], void];
      unstable_stopCall: [[subscription: string], void];
      unstable_stopStorage: [[subscription: string], void];
      unstable_storage: [[
        follow_subscription: U.SubscriptionIdString,
        hash: U.HashHexString,
        key: U.HexString,
        childKey?: U.HexString,
        networkConfig?: T.NetworkConfig,
      ], string];
      unstable_unfollow: [[followSubscription: U.SubscriptionIdString], void];
      unstable_unpin: [[followSubscription: U.SubscriptionIdString, hash: U.HashHexString], void];
    };
    childState: {
      getKeys: TODO_NARROW_METHOD_TYPE;
      getStorage: TODO_NARROW_METHOD_TYPE;
      getStorageHash: TODO_NARROW_METHOD_TYPE;
      getStorageSize: TODO_NARROW_METHOD_TYPE;
    };
    chainSpec: {
      unstable_chainName: [[], string];
      unstable_genesisHash: [[], string];
      unstable_properties: [[], unknown];
    };
    grandpa: {
      roundState: TODO_NARROW_METHOD_TYPE;
    };
    offchain: {
      localStorageGet: TODO_NARROW_METHOD_TYPE;
      localStorageSet: TODO_NARROW_METHOD_TYPE;
    };
    payment: {
      queryInfo: [[extrinsic: U.HexString, hash?: U.HashHexString], T.RuntimeDispatchInfo];
    };
    rpc: {
      methods: [[], T.RpcMethods];
    };
    state: {
      call: TODO_NARROW_METHOD_TYPE;
      callAt: KnownRpcMethods["state_call"];
      getKeys: TODO_NARROW_METHOD_TYPE;
      getKeysPagedAt: KnownRpcMethods["state_getKeysPaged"];
      getMetadata: [[hash?: U.HashHexString], string];
      getPairs: TODO_NARROW_METHOD_TYPE;
      getReadProof: TODO_NARROW_METHOD_TYPE;
      getRuntimeVersion: [[at?: U.HashHexString], T.RuntimeVersion];
      getStorage: [[key: U.HexString, hash?: U.HashHexString], U.HexString];
      getStorageHash: TODO_NARROW_METHOD_TYPE;
      getStorageHashAt: KnownRpcMethods["state_getStorageHash"];
      getStorageSize: TODO_NARROW_METHOD_TYPE;
      getStorageSizeAt: KnownRpcMethods["state_getStorageSize"];
      queryStorage: TODO_NARROW_METHOD_TYPE;
      queryStorageAt: [[keys: U.HexString[], at?: U.HashHexString], T.StorageChangeSet];
      subscribeRuntimeVersion: TODO_NARROW_METHOD_TYPE;
      subscribeStorage: [[list: U.HexString[]], rpc.Subscription<"TODO">];
      unsubscribeRuntimeVersion: [[subscription: string], boolean];
      unsubscribeStorage: [[subscription: string], boolean];
      getKeysPaged: [[
        prefix: string | undefined,
        count: number,
        startKey?: U.HexString,
        hash?: U.HashHexString,
      ], U.HexString[]];
    };
    sudo: {
      unstable_p2pDiscover: [[multiaddr: U.MultiAddressString], void];
      unstable_version: [[], string];
    };
    system: {
      accountNextIndex: [[account: U.AccountIdString], number];
      addReservedPeer: TODO_NARROW_METHOD_TYPE;
      chain: [[], string];
      chainType: [[], T.SystemChainTypeKind];
      dryRun: TODO_NARROW_METHOD_TYPE;
      dryRunAt: KnownRpcMethods["system_dryRun"];
      health: [[], T.SystemHealth];
      localListenAddresses: [[], string[]];
      localPeerId: [[], string];
      name: [[], string];
      networkState: TODO_NARROW_METHOD_TYPE;
      nodeRoles: TODO_NARROW_METHOD_TYPE;
      peers: [[], T.SystemPeer[]];
      properties: TODO_NARROW_METHOD_TYPE;
      removeReservedPeer: TODO_NARROW_METHOD_TYPE;
      version: [[], string];
    };
    transaction: {
      unstable_submitAndWatch: [[transaction: U.HexString], rpc.Subscription<"TODO">];
      unstable_unwatch: [[subscription: U.SubscriptionIdString], void];
    };
  }>
{}

type EnsureKnownMethods<Lookup extends Record<string, rpc.ProviderMethods>> = U.U2I<
  {
    [Prefix in keyof Lookup]: {
      [M in keyof Lookup[Prefix] as `${Extract<Prefix, string>}_${Extract<M, string>}`]:
        Lookup[Prefix][M];
    };
  }[keyof Lookup]
>;
