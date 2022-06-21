import { Beacon, beacon } from "../Beacon.ts";
import { Chain } from "../core/Chain.ts";
import { AnyMethods } from "../util/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestChain<M extends AnyMethods = AnyMethods> extends Chain<Beacon<M>> {
  constructor(readonly host?: string) {
    super(beacon(host || "wss://localhost:127.0.0.1:9933"));
  }

  addresses: TestAddresses<this> = new TestAddresses(this);
}

export function testChain<M extends AnyMethods = AnyMethods>(host?: string): TestChain<M> {
  return new TestChain(host);
}
