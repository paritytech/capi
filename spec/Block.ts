import { HashHexString } from "../branded.ts";
import { Chain } from "./Chain.ts";
import { NodeBase, NodeKind } from "./Node.ts";

export class Block extends NodeBase {
  readonly kind = NodeKind.Block;

  constructor(
    readonly chain: Chain,
    readonly hash: HashHexString,
  ) {
    super();
  }
}
