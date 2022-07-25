import * as Z from "../effect/mod.ts";
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

  read(block?: Block) {
    return Z.run(
      Z.readKeyPage(
        this.chain.config as any,
        this.entry.pallet.name,
        this.entry.name,
        this.count,
        this.start,
        block?.hash,
      ),
    );
  }

  declare watch: (cb: (message: unknown) => void) => any;
}
