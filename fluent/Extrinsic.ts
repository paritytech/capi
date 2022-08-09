import { Call, CallOptions } from "./Call.ts";
import { NodeBase } from "./common.ts";
import { Pallet } from "./Pallet.ts";

// TODO: narrow extrinsic according to config
export class Extrinsic<
  P extends Pallet = Pallet,
  Name extends string = string,
> extends NodeBase<"Extrinsic"> {
  chain;

  constructor(
    readonly pallet: P,
    readonly name: Name,
  ) {
    super();
    this.chain = pallet.chain;
  }

  call<Args extends Record<string, unknown>>(
    args: Args,
    callOptions?: CallOptions,
  ): Call<this, Args> {
    return new Call(this, args, callOptions);
  }
}
