import { Chain } from "./Chain.ts";
import { NodeBase } from "./common.ts";
import { Entry } from "./Entry.ts";
import { Extrinsic } from "./Extrinsic.ts";

// TODO: constrain against `Chain` upon encoding FRAME metadata
export class Pallet<
  C extends Chain = Chain,
  Name extends string = string,
> extends NodeBase<"Pallet"> {
  constructor(
    readonly chain: C,
    readonly name: Name,
  ) {
    super();
  }

  // TODO: constrain
  entry<
    Name extends string,
    // TODO: constrain
    Keys extends unknown[],
  >(
    name: Name,
    ...keys: Keys
  ): Entry<this, Name, Keys> {
    return new Entry(this, name, ...keys);
  }

  // TODO: constrain
  extrinsic<Name extends string>(name: Name): Extrinsic<this, Name> {
    return new Extrinsic(this, name);
  }
}
