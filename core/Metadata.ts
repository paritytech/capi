import { read } from "../runtime/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Metadata<C extends Chain = Chain> extends NodeBase<"Metadata"> {
  constructor(readonly chain: C) {
    super("Metadata");
  }

  read(block?: Block<C>): Promise<unknown> {
    return read(this, block);
  }
}
