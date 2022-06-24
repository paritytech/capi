import { Call } from "./Call.ts";
import { NodeBase } from "./common.ts";
import { Pallet } from "./Pallet.ts";

// TODO: narrow extrinsic according to beacon
export class Extrinsic<
  P extends Pallet = Pallet,
  Name extends string = string,
> extends NodeBase<"Extrinsic"> {
  chain;

  constructor(
    readonly pallet: P,
    readonly name: Name,
  ) {
    super("Extrinsic");
    this.chain = pallet.chain;
  }

  // TODO: constraint
  call<
    Props extends Record<string, unknown>,
    Extra extends unknown[],
    Additional extends unknown,
  >(
    props: Props,
    extra?: Extra,
    additional?: Additional,
  ): Call<this, Props> {
    return new Call(this, props, extra, additional);
  }
}
