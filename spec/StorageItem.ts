import { Codec } from "../_deps/scale.ts";
import { Block } from "./Block.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";
import { Read } from "./Read.ts";

export class StorageItem<T = unknown> extends NodeBase {
  readonly kind = NodeKind.StorageItem;

  constructor(
    readonly pallet: Pallet,
    readonly entryName: string,
    readonly block?: Block,
    readonly codec?: Codec<T>,
  ) {
    super();
  }

  read(): Read<this> {
    return new Read(this);
  }
}
