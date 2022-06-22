import { Addresses as Addresses_ } from "../Addresses.ts";
import { TestAddress } from "./Address.ts";
import { TestChain } from "./Chain.ts";

export class TestAddresses<C extends TestChain = TestChain> extends Addresses_<C> {
  alice: TestAddress<this> = new TestAddress(this, "Alice");
  bob: TestAddress<this> = new TestAddress(this, "Bob");
}
