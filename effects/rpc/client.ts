import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";

export function client<
  DiscoveryValue,
  SendErrorData,
  HandlerErrorData,
  CloseErrorData,
  DiscoveryValueZ extends Z.$<DiscoveryValue>,
>(
  provider: rpc.Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValueZ,
) {
  return Z
    .ls(provider, discoveryValue)
    .next(function initClient([_, discoveryValue]) {
      return new rpc.Client(provider, discoveryValue as DiscoveryValue);
    })
    .zoned("RpcClient");
}
