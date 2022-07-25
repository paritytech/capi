import { Config } from "../config/mod.ts";
import { rpc, TmpMetadata } from "../known/mod.ts";
import { Node } from "./node.ts";

export function config(node: Node) {
  return new class TestConfig extends Config.from<
    rpc.Methods,
    rpc.SubscriptionMethods,
    rpc.ErrorDetails,
    TmpMetadata
  >()(node.url) {}();
}
