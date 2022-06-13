import * as B from "../branded.ts";
import { Block } from "./Block.ts";
import { Metadata } from "./Metadata.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";

export type Beacon = B.WsUrlString | B.ChainSpecString;

export class Chain extends NodeBase {
  readonly kind = NodeKind.Chain;

  constructor(readonly beacon: Beacon) {
    super();
  }

  metadata(block?: Block): Metadata {
    return new Metadata(this, block);
  }

  block(hash?: B.HashHexString): Block {
    return new Block(this, hash);
  }

  pallet(name: string): Pallet {
    return new Pallet(this, name);
  }
}

export function chain(beacon: Beacon): Chain {
  return new Chain(beacon);
}
