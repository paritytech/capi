import { run } from "../effect/run.ts";
import { readBlock } from "../effect/std/block/read.ts";
import { HashHexString } from "../util/mod.ts";
import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";

export class Block<C extends Chain = Chain> extends NodeBase<"Block"> {
  constructor(
    readonly chain: C,
    readonly hash?: HashHexString,
  ) {
    super();
  }

  read() {
    return run(readBlock(this.chain.config as any, this.hash));
  }
}
