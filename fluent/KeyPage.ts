import * as R from "../runtime/mod.ts";
import { Block } from "./Block.ts";
import { NodeBase } from "./common.ts";
import { Entry } from "./Entry.ts";

// TODO: constrain to map entry / key types
export class KeyPage<E extends Entry = Entry> extends NodeBase<"KeyPage"> {
  chain;
  start;

  constructor(
    readonly entry: E,
    readonly count: number,
    ...start: unknown[]
  ) {
    super();
    this.chain = entry.chain;
    this.start = start;
  }

  read(block?: Block): Promise<unknown> {
    return R.read(this, block);
  }

  watch(cb: (message: unknown) => void): any /* TODO */ {
    return R.watch(this, cb);
  }
}
