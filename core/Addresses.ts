import { Address } from "./Address.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Addresses<C extends Chain = Chain> extends NodeBase<"Addresses"> {
  constructor(readonly chain: C) {
    super("Addresses");
  }

  signature(): string {
    return "Addresses";
  }

  // TODO: constrain `text` with brand
  fromPublicKeyBytes(bytes: Uint8Array): Address<this, "PublicKeyBytes"> {
    return new Address(this, {
      type: "PublicKeyBytes",
      raw: bytes,
    });
  }

  // TODO: constrain `text` with brand
  fromPublicKeyText(text: string): Address<this, "PublicKeyText"> {
    return new Address(this, {
      type: "PublicKeyText",
      raw: text,
    });
  }

  // TODO: constrain `text` with brand
  fromSs58Bytes(bytes: Uint8Array): Address<this, "Ss58Bytes"> {
    return new Address(this, {
      type: "Ss58Bytes",
      raw: bytes,
    });
  }

  // TODO: constrain `text` with brand
  fromSs58Text(text: string): Address<this, "Ss58Text"> {
    return new Address(this, {
      type: "Ss58Text",
      raw: text,
    });
  }
}
