export type MethodName =
  | "account_nextIndex"
  | "author_hasKey"
  | "author_hasSessionKeys"
  | "author_pendingExtrinsics"
  | "author_removeExtrinsics"
  | "author_rotateKeys"
  | "author_submitAndWatchExtrinsic"
  | "author_submitExtrinsic"
  | "author_unwatchExtrinsic"
  | "babe_epochAuthorship"
  | "chain_getBlock"
  | "chain_getBlockHash"
  | "chain_getFinalisedHead"
  | "chain_getFinalizedHead"
  | "chain_subscribeAllHeads"
  | "chainHead_unstable_follow"
  | "rpc_methods"
  | "state_getMetadata"
  | "state_getStorage"
  | "system_chainType"
  | "system_health";

export type EnsureMethodLookup<
  Constraint,
  Lookup extends { [_ in MethodName]: Constraint },
> = Lookup;

export type IsSubscription = EnsureMethodLookup<boolean, {
  account_nextIndex: false;
  author_hasKey: false;
  author_hasSessionKeys: false;
  author_pendingExtrinsics: false;
  author_removeExtrinsics: false;
  author_rotateKeys: false;
  author_submitAndWatchExtrinsic: true;
  author_submitExtrinsic: false;
  author_unwatchExtrinsic: false;
  babe_epochAuthorship: false;
  chain_getBlock: false;
  chain_getBlockHash: false;
  chain_getFinalisedHead: false;
  chain_getFinalizedHead: false;
  chain_subscribeAllHeads: true;
  chainHead_unstable_follow: true;
  rpc_methods: false;
  state_getMetadata: false;
  state_getStorage: false;
  system_chainType: false;
  system_health: false;
}>;

export type SubscriptionMethodName = keyof {
  [N in keyof IsSubscription as IsSubscription[N] extends true ? N : never]: undefined;
};

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitBase<
  MethodName_ extends MethodName,
  Params extends unknown[] = [],
> extends JsonRpcVersionBearer {
  id: string;
  method: MethodName_;
  params: Params;
}

export interface ResBase<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
}

export interface NotifBase<
  MethodName_ extends SubscriptionMethodName,
  Result,
> extends JsonRpcVersionBearer {
  method: MethodName_;
  params: {
    subscription: string;
    result: Result;
  };
}
