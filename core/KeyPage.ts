import { Base } from "./Base.ts";
import { Block } from "./Block.ts";
import { Entry } from "./Entry.ts";
import { Read } from "./Read.ts";

// TODO: constrain to map entry / key types
export class KeyPage<E extends Entry = Entry> extends Base<"KeyPage"> {
  chain;

  constructor(
    readonly entry: E,
    readonly count: number,
    readonly offset?: number,
  ) {
    super("KeyPage");
    this.chain = entry.chain;
  }

  read(block?: Block): Read<this> {
    return new Read(this, block);
  }
}
