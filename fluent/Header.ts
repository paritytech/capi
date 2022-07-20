import * as R from "../runtime/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Header<C extends Chain = Chain> extends NodeBase<"Header"> {
  constructor(readonly chain: C) {
    super();
  }

  // TODO
  read(block?: Block<C>): Promise<unknown> {
    return R.read(this, block);
  }

  watch(cb: (message: unknown) => void): any /* TODO */ {
    return R.watch(this, cb);
  }
}
