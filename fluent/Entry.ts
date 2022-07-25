import * as Z from "../effect/mod.ts";
import { Block } from "./Block.ts";
import { NodeBase } from "./common.ts";
import { KeyPage } from "./KeyPage.ts";
import { Pallet } from "./Pallet.ts";

export class Entry<
  P extends Pallet = Pallet,
  Name extends string = string,
  Keys extends unknown[] = unknown[], // TODO: constrain
> extends NodeBase<"Entry"> {
  chain;
  keys;

  constructor(
    readonly pallet: P,
    readonly name: Name,
    ...keys: Keys
  ) {
    super();
    this.chain = pallet.chain;
    this.keys = keys;
  }

  keyPage(count: number, ...start: unknown[]): KeyPage<this> {
    return new KeyPage(this, count, ...start);
  }

  read(block?: Block<P["chain"]>) {
    return Z.run(
      Z.readEntry(
        // TODO: better typings on `chain.config`
        this.pallet.chain.config as any,
        this.pallet.name,
        this.name,
        this.keys,
        block?.hash,
      ),
    );
  }

  declare watch: (cb: (message: unknown) => void) => any;
}
