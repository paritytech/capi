import { Address } from "./Address.ts";
import { Addresses } from "./Addresses.ts";
import { Call } from "./Call.ts";
import { NodeBase } from "./common.ts";

export class Signed<
  C extends Call = Call,
  From extends Address<Addresses<C["chain"]>> = Address<Addresses<C["chain"]>>,
> extends NodeBase<"Signed"> {
  chain;

  constructor(
    readonly call: C,
    readonly from: From,
    readonly sign: (message: Uint8Array) => Promise<Uint8Array>,
  ) {
    super();
    this.chain = call.chain;
  }

  declare send: () => any;
}
