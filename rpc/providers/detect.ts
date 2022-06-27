import { unreachable } from "../../_deps/asserts.ts";
import { AnyMethods } from "../../util/mod.ts";
import { ProxyBeacon, ProxyClient, proxyClient } from "./proxy.ts";
import { SmoldotBeacon, SmoldotClient, smoldotClient } from "./smoldot.ts";

export type StdBeacon<M extends AnyMethods> = ProxyBeacon<M> | SmoldotBeacon<M>;
export type StdClient<M extends AnyMethods> = ProxyClient<M> | SmoldotClient<M>;

export function detectClient<M extends AnyMethods>(beacon: ProxyBeacon<M> | SmoldotBeacon<M>) {
  if (beacon instanceof ProxyBeacon) {
    return proxyClient(beacon);
  } else if (beacon instanceof SmoldotBeacon) {
    return smoldotClient(beacon);
  } else {
    unreachable();
  }
}
