import { HashHexString } from "../branded.ts";
import { Chain } from "./Chain.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Read } from "./Read.ts";

export class Block extends NodeBase {
  readonly kind = NodeKind.Block;

  constructor(
    readonly chain: Chain,
    readonly hash: HashHexString,
  ) {
    super();
  }

  read(): Read<this> {
    return new Read(this);
  }
}
