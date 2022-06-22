import { Address, AddressRawBySourceKind } from "../Address.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestAddress<A extends TestAddresses = TestAddresses> extends Address<A, "Test"> {
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
