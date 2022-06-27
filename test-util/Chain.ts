import { Chain } from "../core/Chain.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { ProxyBeacon } from "../rpc/mod.ts";
import { SubstrateNode } from "../util/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestChain extends Chain<ProxyBeacon<KnownRpcMethods>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain(process: SubstrateNode) {
  return new TestChain(new ProxyBeacon(process.url));
}
