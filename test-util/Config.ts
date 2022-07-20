import { config as config_ } from "../Config.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { Node } from "./node.ts";

export type Config = ReturnType<typeof config>;
export function config(node: Node) {
  class TestConfig extends config_<KnownRpcMethods, {
    pallets: {
      Balances: {
        entries: {};
      };
    };
  }>()(node.url) {}
  return new TestConfig();
}
