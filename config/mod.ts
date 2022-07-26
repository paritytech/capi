import * as rpc from "../rpc/mod.ts";
import type * as M from "./metadata.ts";

/** We represent as a class, not a branded type, because we want to extend into a pretty signature. */
export class Config<
  DiscoveryValue = any,
  RpcCallMethods extends rpc.ProviderMethods = rpc.ProviderMethods,
  RpcSubscriptionMethods extends rpc.ProviderMethods = rpc.ProviderMethods,
  RpcErrorDetails extends rpc.ErrorDetails = rpc.ErrorDetails,
  Metadata extends M.Metadata = M.Metadata,
> {
  RpcMethods!: RpcCallMethods & RpcSubscriptionMethods;
  RpcCallMethods!: RpcCallMethods;
  RpcSubscriptionMethods!: RpcSubscriptionMethods;
  RpcErrorDetails!: RpcErrorDetails;
  Metadata!: Metadata;

  constructor(readonly discoveryValue: DiscoveryValue) {}
}

export namespace Config {
  export function from<
    RpcMethods extends rpc.ProviderMethods,
    RpcSubscriptionMethods extends rpc.ProviderMethods,
    RpcErrorDetails extends rpc.ErrorDetails,
    Metadata extends M.Metadata,
  >() {
    return <D>(discoveryValue: D) => {
      return class
        extends Config<D, RpcMethods, RpcSubscriptionMethods, RpcErrorDetails, Metadata>
      {
        constructor() {
          super(discoveryValue);
        }
      };
    };
  }
}
