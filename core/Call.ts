import { Address } from "./Address.ts";
import { Addresses } from "./Addresses.ts";
import { Base } from "./Base.ts";
import { Extrinsic } from "./Extrinsic.ts";
import { Send } from "./Send.ts";
import { Signed } from "./Signed.ts";

// TODO: constraint `Props` according to metadata
export class Call<
  E extends Extrinsic = Extrinsic,
  Props extends Record<string, unknown> = Record<string, unknown>,
> extends Base<"Call"> {
  chain;

  constructor(
    readonly extrinsic: E,
    readonly props: Props,
  ) {
    super("Call");
    this.chain = extrinsic.chain;
  }

  signed<From extends Address<Addresses<this["chain"]>> = Address<Addresses<this["chain"]>>>(
    from: From,
    sign: (message: Uint8Array) => Uint8Array,
  ): Signed<this> {
    return new Signed(this, from, sign);
  }

  send(): Send<this> {
    return new Send(this);
  }
}
