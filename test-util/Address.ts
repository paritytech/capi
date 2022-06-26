import { Address } from "../core/Address.ts";
import { TEST_PAIRS } from "../known/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestAddress<A extends TestAddresses = TestAddresses>
  extends Address<A, "PublicKeyText">
{
  constructor(
    addresses: A,
    name: keyof typeof TEST_PAIRS,
  ) {
    // TODO:
    super(addresses, {
      type: "PublicKeyText",
      raw: TEST_PAIRS[name]["public"],
    });
  }

  // TODO
  sign = async (message: Uint8Array): Promise<Uint8Array> => {
    return new Uint8Array();
  };
}
