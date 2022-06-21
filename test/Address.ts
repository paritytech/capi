import { Address as Address_, AddressRawBySourceKind } from "../core/Address.ts";
import { Addresses } from "./Addresses.ts";

export class Address<A extends Addresses = Addresses> extends Address_<A, "Test"> {
  constructor(
    addresses: A,
    testUser: AddressRawBySourceKind["Test"],
  ) {
    super(addresses, "Test", testUser);
  }

  // TODO
  sign = (message: Uint8Array): Uint8Array => {
    return new Uint8Array();
  };
}
