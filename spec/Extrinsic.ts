import { MultiAddress } from "../primitives/MultiAddress.ts";
import { ExtrinsicFactory } from "./ExtrinsicFactory.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { SignedExtrinsic } from "./SignedExtrinsic.ts";

export class Extrinsic<
  CallData extends Record<string, unknown> = Record<string, any>,
  Extra extends unknown[] = any[],
  Additional extends unknown = any,
> extends NodeBase {
  readonly kind = NodeKind.Extrinsic;

  constructor(
    readonly factory: ExtrinsicFactory<CallData>,
    readonly caller: MultiAddress,
    readonly callData: CallData,
    readonly extra?: Extra,
    readonly additional?: Additional,
  ) {
    super();
  }

  sign(sign: (message: Uint8Array) => Uint8Array): SignedExtrinsic {
    return new SignedExtrinsic(this as Extrinsic, sign);
  }
}
