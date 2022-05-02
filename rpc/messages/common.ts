export type MethodName =
  | "chain_getBlock"
  | "chain_getBlockHash"
  | "chain_subscribeAllHeads"
  | "chainHead_unstable_follow"
  | "state_getMetadata"
  | "state_getStorage"
  | "system_chainType"
  | "system_health";

export type EnsureMethodLookup<
  Constraint,
  Lookup extends {
    [_ in MethodName]: Constraint;
  },
> = Lookup;

export type IsSubscription = EnsureMethodLookup<boolean, {
  chain_getBlock: false;
  chain_getBlockHash: false;
  chain_subscribeAllHeads: true;
  chainHead_unstable_follow: true;
  state_getMetadata: false;
  state_getStorage: false;
  system_chainType: false;
  system_health: false;
}>;

export type SubscriptionMethodName = keyof {
  [N in keyof IsSubscription as IsSubscription[N] extends true ? N : never]: undefined;
};

export type EnsureSubscriptionMethodLookup<
  Constraint,
  Lookup extends {
    [_ in SubscriptionMethodName]: Constraint;
  },
> = Lookup;

export const JSON_RPC_VERSION = "2.0";
export type JSON_RPC_VERSION = typeof JSON_RPC_VERSION;

interface JsonRpcVersionBearer {
  jsonrpc: JSON_RPC_VERSION;
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
