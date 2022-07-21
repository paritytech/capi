import { Chain } from "../fluent/Chain.ts";
import { TestAddresses } from "./Addresses.ts";
import { config } from "./config.ts";
import { Node } from "./node.ts";

export class TestChain extends Chain<ReturnType<typeof config>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain(node: Node) {
  return new TestChain(config(node));
}
