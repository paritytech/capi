import { Codec } from "../_deps/scale.ts";
import { MultiAddress } from "../primitives/MultiAddress.ts";
import { Extrinsic } from "./Extrinsic.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";

export class ExtrinsicFactory<CallData extends Record<string, unknown> = Record<string, any>>
  extends NodeBase
{
  readonly kind = NodeKind.ExtrinsicFactory;

  constructor(
    readonly pallet: Pallet,
    readonly methodName: string,
    readonly callDataCodec?: Codec<CallData>,
  ) {
    super();
  }

  create(caller: MultiAddress, callData: CallData): Extrinsic<CallData> {
    return new Extrinsic(this, caller, callData);
  }
}
