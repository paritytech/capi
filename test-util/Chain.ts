import { Chain } from "../bindings/Chain.ts";
import { TestAddresses } from "./Addresses.ts";
import { config } from "./Config.ts";
import { TestNode } from "./node.ts";

export class TestChain extends Chain<ReturnType<typeof config>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain(node: TestNode) {
  return new TestChain(config(node));
}
