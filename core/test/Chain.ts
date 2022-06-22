import { Beacon, beacon } from "../../Beacon.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import { Chain as Chain_ } from "../Chain.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestChain extends Chain_<Beacon<string, KnownRpcMethods>> {
  addresses: TestAddresses<this> = new TestAddresses(this);
}

export const testChain = new TestChain(beacon("wss://localhost:127.0.0.1:9933"));
