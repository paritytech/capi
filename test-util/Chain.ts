import { Chain } from "../bindings/Chain.ts";
import { AnyMeta, Config, config } from "../Config.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { TestAddresses } from "./Addresses.ts";
import { TestNode } from "./node.ts";

export class TestChain extends Chain<Config<string, KnownRpcMethods, AnyMeta>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain(node: TestNode) {
  class TestConfig extends config<KnownRpcMethods, AnyMeta>()(node.url) {}
  return new TestChain(new TestConfig());
}
