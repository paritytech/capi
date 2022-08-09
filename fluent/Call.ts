import * as M from "../frame_metadata/mod.ts";
import { NodeBase } from "./common.ts";
import { Extrinsic } from "./Extrinsic.ts";
import { Signed } from "./Signed.ts";

// TODO: constraint `Props` according to metadata
export class Call<
  E extends Extrinsic = Extrinsic,
  Args extends Record<string, unknown> = Record<string, any>,
> extends NodeBase<"Call"> {
  chain;

  constructor(
    readonly extrinsic: E,
    readonly args: Args,
    readonly options?: CallOptions,
  ) {
    super();
    this.chain = extrinsic.chain;
  }

  signed(
    from: M.MultiAddress,
    sign: M.SignExtrinsic,
  ): Signed<this> {
    return new Signed(this, from, sign);
  }

  declare send: () => any;
}

export interface CallOptions {
  checkpoint?: string;
  mortality?: [period: bigint, phase: bigint];
  tip?: bigint;
  nonce?: number;
}
