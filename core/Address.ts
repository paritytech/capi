import { MultiAddress } from "../primitives/MultiAddress.ts";
import { Addresses } from "./Addresses.ts";
import { NodeBase } from "./common.ts";

export type AddressRawBySourceKind = {
  Ss58Bytes: {
    type: "Ss58Bytes";
    raw: Uint8Array;
  };
  Ss58Text: {
    type: "Ss58Text";
    raw: string;
  };
  PublicKeyBytes: {
    type: "PublicKeyBytes";
    raw: Uint8Array;
  };
  PublicKeyText: {
    type: "PublicKeyText";
    raw: string;
  };
};

export class Address<
  A extends Addresses = Addresses,
  SourceKind extends keyof AddressRawBySourceKind = keyof AddressRawBySourceKind,
> extends NodeBase<"Address"> {
  chain;

  constructor(
    readonly addresses: A,
    readonly source: AddressRawBySourceKind[SourceKind],
  ) {
    super("Address");
    this.chain = addresses.chain;
  }

  declare asPublicKeyBytes: () => Uint8Array;
  declare asPublicKeyText: () => string;
  declare asSs58Bytes: () => Uint8Array;
  declare asSs58Text: () => string;
  declare asMulti: () => MultiAddress;
}
