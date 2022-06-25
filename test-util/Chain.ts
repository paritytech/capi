import { Beacon, beacon } from "../Beacon.ts";
import { Chain } from "../core/Chain.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { LocalClientProps } from "../rpc/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestChain extends Chain<Beacon<LocalClientProps<KnownRpcMethods>, KnownRpcMethods>> {
  addresses: TestAddresses<this> = new TestAddresses(this);
}

export function chain() {
  return new TestChain(beacon<LocalClientProps<KnownRpcMethods>, KnownRpcMethods>({
    path: "./node-template",
    cwd: new URL(".", import.meta.url).pathname,
    dev: true,
  }));
}
