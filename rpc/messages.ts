import { Block, Head } from "./common.ts";

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitBase<
  MethodName extends string,
  Params extends unknown[],
> extends JsonRpcVersionBearer {
  id: string;
  method: MethodName;
  params: Params;
}

export interface ResBase<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
}

export interface NotifBase<
  MethodName extends string,
  Result,
> extends JsonRpcVersionBearer {
  method: MethodName;
  params: {
    subscription: string;
    result: Result;
  };
}

export type Name = keyof Lookup;

export type InitByName = {
  [N in Name]: InitBase<N, Lookup[N] extends { params: infer Params } ? Params extends unknown[] ? Params : never : []>;
};
export type GetInit<N extends Name> = InitByName[N];
export type Init = GetInit<Name>;

export type ResByName = { [N in Name]: ResBase<Lookup[N]["result"]> };
export type GetRes<N extends Name> = ResByName[N];
export type Res = GetRes<Name>;

export type NotifByName = {
  [N in Name as Lookup[N] extends { notifResult: unknown } ? N : never]: NotifBase<
    N,
    Lookup[N] extends { notifResult: infer N } ? N : never
  >;
};
export type SubscriptionName = keyof NotifByName;
export type GetNotif<N extends SubscriptionName> = NotifByName[N];
export type Notif = GetNotif<SubscriptionName>;

export type IngressMessage = Res | Notif;

type EnsureLookup<
  T extends Record<string, {
    params?: unknown[];
    result: unknown;
    notifResult?: unknown;
  }>,
> = T;

export type Lookup = EnsureLookup<{
  account_nextIndex: {
    result: unknown;
  };
  author_hasKey: {
    params: [pubKey: string, keyType: string];
    result: string;
  };
  author_hasSessionKeys: {
    result: string;
  };
  author_pendingExtrinsics: {
    params: [string];
    result: string[];
  };
  author_removeExtrinsics: {
    result: unknown;
  };
  author_rotateKeys: {
    result: string;
  };
  author_submitAndWatchExtrinsic: {
    params: [tx: string];
    result: string;
    notifResult: unknown;
  };
  author_unwatchExtrinsic: {
    params: [subscription: string];
    result: unknown;
  };
  babe_epochAuthorship: {
    params: [unknown];
    result: unknown;
  };
  chain_getBlock: {
    params: [blockHash?: string];
    result: {
      block: Block;
      justifications: null; // TODO...
    };
  };
  chain_getBlockHash: {
    params: [height?: number];
    result: string;
  };
  chain_getHead: Lookup["chain_getBlockHash"];
  chain_getFinalizedHead: {
    result: unknown;
  };
  chain_getFinalisedHead: Lookup["chain_getFinalizedHead"];
  chain_getHeader: {
    result: unknown;
  };
  chain_subscribeAllHeads: {
    result: string;
    notifResult: Head;
  };
  chainHead_unstable_follow: {
    params: [runtimeUpdates: boolean];
    result: { id: string };
    notifResult: ChainHeadUnstableFollowEvent;
  };
  rpc_methods: {
    result: string[];
  };
  state_getMetadata: {
    params: [blockHash?: string];
    result: string;
  };
  state_getStorage: {
    params: [key: string, blockHash?: string];
    result: string;
  };
  system_chainType: {
    result: SystemChainTypeKind;
  };
  system_health: {
    result: {
      isSyncing: boolean;
      peers: number;
      shouldHavePeers: boolean;
    };
  };
}>;

export type ChainHeadUnstableFollowEvent =
  | ChainHeadUnstableFollowInitializedEvent
  | ChainHeadUnstableFollowNewBlockEvent
  | ChainHeadUnstableFollowBestBlockChangedEvent
  | ChainHeadUnstableFollowFinalizedEvent
  | ChainHeadUnstableFollowStopEvent;
export type ChainHeadUnstableFollowEventKind =
  | "initialized"
  | "newBlock"
  | "bestBlockChanged"
  | "finalized"
  | "stop";
interface ChainHeadUnstableFollowEventBase<Kind extends ChainHeadUnstableFollowEventKind> {
  event: Kind;
}
export interface ChainHeadUnstableFollowInitializedEvent extends ChainHeadUnstableFollowEventBase<"initialized"> {
  finalizedBlockHash: string;
  finalizedBlockRuntime: string;
}
export interface ChainHeadUnstableFollowNewBlockEvent extends ChainHeadUnstableFollowEventBase<"newBlock"> {
  blockHash: string;
  parentBlockHash: string;
  newRuntime: null; // TODO
}
export interface ChainHeadUnstableFollowBestBlockChangedEvent
  extends ChainHeadUnstableFollowEventBase<"bestBlockChanged">
{
  bestBlockHash: string;
}
export interface ChainHeadUnstableFollowFinalizedEvent extends ChainHeadUnstableFollowEventBase<"finalized"> {
  finalizedBlocksHashes: string[];
  prunedBlocksHashes: string[];
}
export type ChainHeadUnstableFollowStopEvent = ChainHeadUnstableFollowEventBase<"stop">;

export const enum SystemChainTypeKind {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}
