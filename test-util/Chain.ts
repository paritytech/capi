import { Chain } from "../bindings/Chain.ts";
import { Config, config, Meta } from "../Config.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { TestAddresses } from "./Addresses.ts";
import { TestNode } from "./node.ts";

export class TestChain extends Chain<Config<string, KnownRpcMethods, Meta>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain(node: TestNode) {
  class TestConfig extends config<KnownRpcMethods, Meta>()(node.url) {}
  return new TestChain(new TestConfig());
}
