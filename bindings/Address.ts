import { unimplemented } from "../_deps/asserts.ts";
import { Ss58 } from "../ss58/mod.ts";
import * as U from "../util/mod.ts";
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
    super();
    this.chain = addresses.chain;
  }

  asPublicKeyBytes = async (): Promise<Uint8Array> => {
    switch (this.source.type) {
      case "Ss58Text": {
        return U.hex.decode((await Ss58()).decode(this.source.raw)[1]);
      }
      case "PublicKeyText": {
        return U.hex.decode(this.source.raw);
      }
      default: {
        unimplemented();
      }
    }
  };

  declare asPublicKeyText: () => string;
  declare asSs58Bytes: () => Uint8Array;
  declare asSs58Text: () => string;
}
