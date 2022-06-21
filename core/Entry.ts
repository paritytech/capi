import { Base } from "./Base.ts";
import { KeyPage } from "./KeyPage.ts";
import { Pallet } from "./Pallet.ts";
import { Read } from "./Read.ts";

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

  read(): Read<this> {
    return new Read(this);
  }
}
