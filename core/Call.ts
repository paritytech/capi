import { send } from "../runtime/mod.ts";
import { Address } from "./Address.ts";
import { Addresses } from "./Addresses.ts";
import { NodeBase } from "./common.ts";
import { Extrinsic } from "./Extrinsic.ts";
import { Signed } from "./Signed.ts";

// TODO: constraint `Props` according to metadata
export class Call<
  E extends Extrinsic = Extrinsic,
  Props extends Record<string, unknown> = Record<string, unknown>,
  Extra extends unknown[] = any[],
  Additional extends unknown = any,
> extends NodeBase<"Call"> {
  chain;

  constructor(
    readonly extrinsic: E,
    readonly props: Props,
    readonly extra?: Extra,
    readonly additional?: Additional,
  ) {
    super("Call");
    this.chain = extrinsic.chain;
  }

  signed<From extends Address<Addresses<this["chain"]>> = Address<Addresses<this["chain"]>>>(
    from: From,
    sign: (message: Uint8Array) => Promise<Uint8Array>,
  ): Signed<this> {
    return new Signed(this, from, sign);
  }

  send() {
    return send(this);
  }
}
