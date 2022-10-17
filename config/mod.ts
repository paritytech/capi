import * as rpc from "../rpc/mod.ts";

export class Config<
  DiscoveryValue = any,
  RpcCallMethods extends rpc.ProviderMethods = rpc.ProviderMethods,
  RpcSubscriptionMethods extends rpc.ProviderMethods = rpc.ProviderMethods,
  RpcErrorDetails extends rpc.ErrorDetails = rpc.ErrorDetails,
> {
  // TODO: get rid of this gunk
  RpcMethods!: RpcCallMethods & RpcSubscriptionMethods;
  RpcCallMethods!: RpcCallMethods;
  RpcSubscriptionMethods!: RpcSubscriptionMethods;
  RpcErrorDetails!: RpcErrorDetails;

  #discoveryValue?: DiscoveryValue | Promise<DiscoveryValue>;

  constructor(
    readonly initDiscoveryValue: () => DiscoveryValue | Promise<DiscoveryValue>,
    readonly addressPrefix: number,
  ) {}

  get discoveryValue() {
    if (!this.#discoveryValue) {
      this.#discoveryValue = this.initDiscoveryValue();
    }
    return this.#discoveryValue;
  }
}
