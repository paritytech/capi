export const enum MethodName {
  ChainGetBlock = "chain_getBlock",
  ChainGetBlockHash = "chain_getBlockHash",
  ChainHeadUnstableFollow = "chainHead_unstable_follow",
  StateGetMetadata = "state_getMetadata",
  StateGetStorage = "state_getStorage",
  SystemChainType = "system_chainType",
  SystemHealth = "system_health",
}

export type EnsureLookup<
  Constraint,
  Lookup extends {
    [_ in MethodName]: Constraint;
  },
> = Lookup;

export type IsSubscription = EnsureLookup<boolean, {
  [MethodName.ChainGetBlock]: false;
  [MethodName.ChainGetBlockHash]: false;
  [MethodName.ChainHeadUnstableFollow]: true;
  [MethodName.StateGetMetadata]: false;
  [MethodName.StateGetStorage]: false;
  [MethodName.SystemChainType]: false;
  [MethodName.SystemHealth]: false;
}>;

export type SubscriptionMethodName = keyof {
  [N in keyof IsSubscription as IsSubscription[N] extends true ? N : never]: undefined;
};
export type OpaqueMethodName = Exclude<MethodName, SubscriptionMethodName>;

export const JSON_RPC_VERSION = "2.0";
export type JSON_RPC_VERSION = typeof JSON_RPC_VERSION;

interface JsonRpcVersionBearer {
  jsonrpc: JSON_RPC_VERSION;
}

export interface EgressMessageBase<
  MethodName_ extends MethodName,
  Params extends unknown[] = [],
> extends JsonRpcVersionBearer {
  id: string;
  method: MethodName_;
  params: Params;
}

export interface IngressOpaqueMessage<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
}

export interface IngressNotificationMessage<
  MethodName_ extends MethodName,
  Result,
> extends JsonRpcVersionBearer {
  method: MethodName_;
  params: {
    subscription: string;
    result: Result;
  };
}
