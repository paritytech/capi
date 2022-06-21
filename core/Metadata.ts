import { Base } from "./Base.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { Read } from "./Read.ts";

export class Metadata<C extends Chain = Chain> extends Base<"Metadata"> {
  constructor(readonly chain: C) {
    super("Metadata");
  }

  read(block?: Block<C>): Read<this> {
    return new Read(this, block);
  }
}
