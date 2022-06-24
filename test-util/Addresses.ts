import { Addresses } from "../core/Addresses.ts";
import { TestAddress } from "./Address.ts";
import { TestChain } from "./Chain.ts";

export class TestAddresses<C extends TestChain = TestChain> extends Addresses<C> {
  alice: TestAddress<this> = new TestAddress(this, "alice");
  bob: TestAddress<this> = new TestAddress(this, "bob");
}
