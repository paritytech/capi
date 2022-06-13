import { Extrinsic } from "./Extrinsic.ts";
import { NodeBase, NodeKind } from "./Node.ts";

export class SignedExtrinsic extends NodeBase {
  readonly kind = NodeKind.SignedExtrinsic;

  constructor(
    readonly extrinsic: Extrinsic,
    readonly sign: (message: Uint8Array) => Uint8Array,
  ) {
    super();
  }
}
