import { Chain } from "../core/Chain.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { ProxyBeacon } from "../rpc/mod.ts";
import { TestAddresses } from "./Addresses.ts";
import { TestNode } from "./node.ts";

export class TestChain extends Chain<ProxyBeacon<KnownRpcMethods>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain(node: TestNode) {
  return new TestChain(new ProxyBeacon(node.url));
}
