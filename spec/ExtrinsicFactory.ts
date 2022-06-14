import { Codec } from "../_deps/scale.ts";
import { MultiAddress } from "../primitives/MultiAddress.ts";
import { Extrinsic } from "./Extrinsic.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";

export class ExtrinsicFactory<
  CallData extends Record<string, unknown> = Record<string, any>,
  Extra extends unknown[] = any[],
  Additional extends unknown = any,
> extends NodeBase {
  readonly kind = NodeKind.ExtrinsicFactory;

  constructor(
    readonly pallet: Pallet,
    readonly methodName: string,
    readonly callDataCodec?: Codec<CallData>,
    readonly extraCodec?: Codec<Extra>,
  ) {
    super();
  }

  create(
    caller: MultiAddress,
    callData: CallData,
    extra?: Extra,
    additional?: Additional,
  ): Extrinsic<CallData> {
    return new Extrinsic(this as any, caller, callData, extra, additional);
  }
}
