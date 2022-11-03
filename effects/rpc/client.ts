import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";

export function client<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>(
  provider: rpc.Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValue,
) {
  return Z.call(Z.ls(provider, discoveryValue), () => {
    return new rpc.Client(provider, discoveryValue);
  });
}
