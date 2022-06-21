import { Address } from "./Address.ts";
import { Base } from "./Base.ts";
import { Chain } from "./Chain.ts";

// TODO: constraints via `C`
export class Addresses<C extends Chain = Chain> extends Base<"Addresses"> {
  constructor(readonly chain: C) {
    super("Addresses");
  }

  // TODO: constrain `text` with brand
  fromPublicKeyBytes(bytes: Uint8Array): Address<this, "PublicKeyBytes"> {
    return new Address(this, "PublicKeyBytes", bytes);
  }

  // TODO: constrain `text` with brand
  fromPublicKeyText(text: string): Address<this, "PublicKeyText"> {
    return new Address(this, "PublicKeyText", text);
  }

  // TODO: constrain `text` with brand
  fromSs58Bytes(bytes: Uint8Array): Address<this, "Ss58Bytes"> {
    return new Address(this, "Ss58Bytes", bytes);
  }

  // TODO: constrain `text` with brand
  fromSs58Text(text: string): Address<this, "Ss58Text"> {
    return new Address(this, "Ss58Text", text);
  }
}
