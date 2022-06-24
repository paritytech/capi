import { Beacon, beacon } from "../Beacon.ts";
import { Chain } from "../core/Chain.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestChain extends Chain<Beacon<string, KnownRpcMethods>> {
  addresses: TestAddresses<this> = new TestAddresses(this);
}

export const test = new TestChain(beacon("wss://localhost:127.0.0.1:9933"));
