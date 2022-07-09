import { Address } from "../bindings/Address.ts";
import { testPairs } from "../known/mod.ts";
import { TestAddresses } from "./Addresses.ts";

export class TestAddress<A extends TestAddresses = TestAddresses>
  extends Address<A, "PublicKeyText">
{
  constructor(
    addresses: A,
    name: keyof typeof testPairs,
  ) {
    // TODO:
    super(addresses, {
      type: "PublicKeyText",
      raw: testPairs[name]["publicText"],
    });
  }

  // TODO
  sign = async (message: Uint8Array): Promise<Uint8Array> => {
    return new Uint8Array();
  };
}
