import { Config } from "../config/mod.ts";
import { rpc, TmpMetadata } from "../known/mod.ts";
import { Node } from "./node.ts";

export function config(node: Node) {
  return new class TestConfig extends Config.from<
    rpc.CallMethods,
    rpc.SubscriptionMethods,
    rpc.ErrorDetails,
    TmpMetadata
  >()(
    node.url,
    node.config?.altRuntime ? ALT_RUNTIME_ADDRESS_PREFIX[node.config.altRuntime] : 0,
  ) {}();
}

const ALT_RUNTIME_ADDRESS_PREFIX = {
  kusama: 2,
  rococo: undefined!, /* TODO */
  westend: 0,
};
