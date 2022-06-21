import { Addresses as Addresses_ } from "../core/Addresses.ts";
import { Address } from "./Address.ts";
import { Chain } from "./Chain.ts";

export class Addresses<C extends Chain = Chain> extends Addresses_<C> {
  alice: Address<this> = new Address(this, "Alice");
  bob: Address<this> = new Address(this, "Bob");
}
