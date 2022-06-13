import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase, NodeKind } from "./Node.ts";

export class Metadata extends NodeBase {
  readonly kind = NodeKind.Metadata;

  constructor(
    readonly chain: Chain,
    readonly block?: Block,
  ) {
    super();
  }
}
