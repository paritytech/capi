import { Beacon } from "../Beacon.ts";
import { Chain } from "../core/Chain.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { LocalBeacon, LocalClientProps } from "../rpc/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestChain extends Chain<Beacon<LocalClientProps, KnownRpcMethods>> {
  override address: TestAddresses<this> = new TestAddresses(this);
}

export function chain() {
  return new TestChain(
    new LocalBeacon({
      path: "./node-template",
      cwd: new URL(".", import.meta.url).pathname,
      dev: true,
    }),
  );
}
