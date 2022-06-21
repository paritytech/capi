import { Address } from "./Address.ts";
import { Addresses } from "./Addresses.ts";
import { Base } from "./Base.ts";
import { Call } from "./Call.ts";
import { Send } from "./Send.ts";

export class Signed<
  C extends Call = Call,
  From extends Address<Addresses<C["chain"]>> = Address<Addresses<C["chain"]>>,
> extends Base<"Base"> {
  chain;

  constructor(
    readonly call: C,
    readonly from: From,
    readonly sign: (message: Uint8Array) => Uint8Array,
  ) {
    super("Base");
    this.chain = call.chain;
  }

  send(): Send<this> {
    return new Send(this);
  }
}
