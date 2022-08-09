import * as Z from "../effect/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Header<C extends Chain = Chain> extends NodeBase<"Header"> {
  constructor(readonly chain: C) {
    super();
  }

  read(block?: Block<C>) {
    return Z.rpcCall(this.chain.config, "chain_getHeader", [block?.hash]);
  }

  declare watch: (cb: (message: unknown) => void) => any;
}
