import { Base } from "./Base.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { Read } from "./Read.ts";
import { Watch } from "./Watch.ts";

export class Head<C extends Chain = Chain> extends Base<"Head"> {
  constructor(readonly chain: C) {
    super("Head");
  }

  read(block?: Block<C>): Read<this> {
    return new Read(this, block);
  }

  watch(): Watch<this> {
    return new Watch(this);
  }
}
