import * as rpc from "../rpc/mod.ts";

/** We represent as a class, not a branded type, because we want to extend into a pretty signature. */
export class Config<
  DiscoveryValue = any,
  RpcCallMethods extends rpc.ProviderMethods = rpc.ProviderMethods,
  RpcSubscriptionMethods extends rpc.ProviderMethods = rpc.ProviderMethods,
  RpcErrorDetails extends rpc.ErrorDetails = rpc.ErrorDetails,
> {
  RpcMethods!: RpcCallMethods & RpcSubscriptionMethods;
  RpcCallMethods!: RpcCallMethods;
  RpcSubscriptionMethods!: RpcSubscriptionMethods;
  RpcErrorDetails!: RpcErrorDetails;

  constructor(
    readonly discoveryValue: DiscoveryValue,
    readonly addressPrefix: number,
  ) {}
}
