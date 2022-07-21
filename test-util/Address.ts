import { Address } from "../fluent/Address.ts";
import { TestAddresses } from "./Addresses.ts";
import { pairs } from "./pairs.ts";

export class TestAddress<A extends TestAddresses = TestAddresses>
  extends Address<A, "PublicKeyText">
{
  constructor(
    addresses: A,
    name: keyof typeof pairs,
  ) {
    // TODO:
    super(addresses, {
      type: "PublicKeyText",
      raw: pairs[name]["publicText"],
    });
  }

  // TODO
  sign = async (message: Uint8Array): Promise<Uint8Array> => {
    return new Uint8Array();
  };
}
