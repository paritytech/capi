import { Addresses } from "../bindings/Addresses.ts";
import { TestAddress } from "./Address.ts";
import { TestChain } from "./Chain.ts";

export class TestAddresses<C extends TestChain = TestChain> extends Addresses<C> {
  alice: TestAddress<this> = new TestAddress(this, "alice");
  bob: TestAddress<this> = new TestAddress(this, "bob");
  charlie: TestAddress<this> = new TestAddress(this, "charlie");
  dave: TestAddress<this> = new TestAddress(this, "dave");
  eve: TestAddress<this> = new TestAddress(this, "eve");
  ferdie: TestAddress<this> = new TestAddress(this, "ferdie");
  one: TestAddress<this> = new TestAddress(this, "one");
  two: TestAddress<this> = new TestAddress(this, "two");
}
