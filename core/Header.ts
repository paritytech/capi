import * as R from "../runtime/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Header<C extends Chain = Chain> extends NodeBase<"Header"> {
  constructor(readonly chain: C) {
    super("Header");
  }

  // TODO
  read(block?: Block<C>): Promise<unknown> {
    return R.read(this, block);
  }

  watch() {
    return R.watch(this);
  }
}
