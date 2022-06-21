import { MultiAddress } from "../primitives/MultiAddress.ts";
import { EnsureLookup } from "../util/mod.ts";
import { Addresses } from "./Addresses.ts";
import { Base } from "./Base.ts";

export type AddressSourceKind =
  | "Ss58Bytes"
  | "Ss58Text"
  | "PublicKeyBytes"
  | "PublicKeyText"
  | "Test";

export type AddressRawBySourceKind = EnsureLookup<AddressSourceKind, unknown, {
  Ss58Bytes: Uint8Array;
  Ss58Text: string;
  PublicKeyBytes: Uint8Array;
  PublicKeyText: string;
  Test: "Alice" | "Bob";
}>;

export class Address<
  A extends Addresses = Addresses,
  SourceKind extends AddressSourceKind = AddressSourceKind,
> extends Base<"Address"> {
  chain;

  constructor(
    readonly addresses: A,
    readonly sourceKind: SourceKind,
    readonly source: AddressRawBySourceKind[SourceKind],
  ) {
    super("Address");
    this.chain = addresses.chain;
  }

  declare asPublicKeyBytes: () => Uint8Array;
  declare asPublicKeyText: () => string;

  declare asSs58Bytes: () => Uint8Array;
  declare asSs58Text: () => string;

  declare asAccountId32: () => Uint8Array;

  declare asMultiAddress: () => MultiAddress;
}
