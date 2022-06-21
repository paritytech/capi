import { Base } from "./Base.ts";
import { Block } from "./Block.ts";
import { KeyPage } from "./KeyPage.ts";
import { Pallet } from "./Pallet.ts";
import { Read } from "./Read.ts";
import { Watch } from "./Watch.ts";

export class Entry<
  P extends Pallet = Pallet,
  Name extends string = string,
  Keys extends unknown[] = unknown[], // TODO: constrain
> extends Base<"Entry"> {
  chain;
  keys;

  constructor(
    readonly pallet: P,
    readonly name: Name,
    ...keys: Keys
  ) {
    super("Entry");
    this.chain = pallet.chain;
    this.keys = keys;
  }

  keyPage(count: number, offset?: number): KeyPage<this> {
    return new KeyPage(this, count, offset);
  }

  read(block?: Block<P["chain"]>): Read<this> {
    return new Read(this, block);
  }

  watch(): Watch<this> {
    return new Watch(this);
  }
}
