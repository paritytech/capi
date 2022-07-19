import { config as config_ } from "../Config.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { TestNode } from "./node.ts";

export function config(node: TestNode) {
  class TestConfig extends config_<KnownRpcMethods, {
    pallets: {
      Balances: {
        entries: {};
      };
    };
  }>()(node.url) {}
  return new TestConfig();
}
