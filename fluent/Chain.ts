import { Config } from "../config/mod.ts";
import { HashHexString } from "../util/mod.ts";
import { Block } from "./Block.ts";
import { NodeBase } from "./common.ts";
import { Header } from "./Header.ts";
import { Metadata } from "./Metadata.ts";
import { Pallet } from "./Pallet.ts";

export class Chain<B extends Config = Config> extends NodeBase<"Chain"> {
  chain;

  constructor(readonly config: B) {
    super();
    this.chain = this;
  }

  block(hash?: HashHexString): Block<this> {
    return new Block(this, hash);
  }

  metadata(): Metadata<this> {
    return new Metadata(this);
  }

  pallet<Name extends string = string>(name: Name): Pallet<this, Name> {
    return new Pallet(this, name);
  }

  head(): Header<this> {
    return new Header(this);
  }
}
export const chain = <B extends Config>(config: B): Chain<B> => {
  return new Chain(config);
};
