import * as R from "../runtime/mod.ts";
import { Block } from "./Block.ts";
import { NodeBase } from "./common.ts";
import { Entry } from "./Entry.ts";

// TODO: constrain to map entry / key types
export class KeyPage<E extends Entry = Entry> extends NodeBase<"KeyPage"> {
  chain;

  constructor(
    readonly entry: E,
    readonly count: number,
    readonly offset?: number,
  ) {
    super("KeyPage");
    this.chain = entry.chain;
  }

  read(block?: Block): Promise<unknown> {
    return R.read(this, block);
  }

  watch() {
    return R.watch(this);
  }
}
