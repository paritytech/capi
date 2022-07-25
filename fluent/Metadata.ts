import * as Z from "../effect/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Metadata<C extends Chain = Chain> extends NodeBase<"Metadata"> {
  constructor(readonly chain: C) {
    super();
  }

  read(block?: Block<C>) {
    return Z.run(Z.metadata(this.chain.config as any, block?.hash));
  }
}
