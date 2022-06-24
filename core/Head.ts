import * as R from "../runtime/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Head<C extends Chain = Chain> extends NodeBase<"Head"> {
  constructor(readonly chain: C) {
    super("Head");
  }

  // TODO
  read(block?: Block<C>): Promise<unknown> {
    return R.read(this, block);
  }

  watch() {
    return R.watch(this);
  }
}
