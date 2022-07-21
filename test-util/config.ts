import { Config } from "../config/mod.ts";
import { KnownRpcMethods, TmpMetadata } from "../known/mod.ts";
import { Node } from "./node.ts";

export function config(node: Node) {
  return new class TestConfig extends Config.from<KnownRpcMethods, TmpMetadata>()(node.url) {}();
}
