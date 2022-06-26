import { Beacon } from "../Beacon.ts";
import { HashHexString } from "../util/mod.ts";
import { Addresses } from "./Addresses.ts";
import { Block } from "./Block.ts";
import { NodeBase } from "./common.ts";
import { Head } from "./Head.ts";
import { Metadata } from "./Metadata.ts";
import { Pallet } from "./Pallet.ts";

export class Chain<
  B extends Beacon = Beacon,
> extends NodeBase<"Chain"> {
  constructor(readonly beacon: B) {
    super("Chain");
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

  address: Addresses<this> = new Addresses(this);

  head(): Head<this> {
    return new Head(this);
  }
}
export const chain = <B extends Beacon>(beacon: B): Chain<B> => {
  return new Chain(beacon);
};
