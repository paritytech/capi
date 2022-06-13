import { Block } from "./Block.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Read } from "./Read.ts";
import { StorageMap, StorageMapKeys } from "./StorageMap.ts";

export class StorageMapValue<M extends StorageMap = StorageMap> extends NodeBase {
  readonly kind = NodeKind.StorageMapValue;

  constructor(
    readonly storageMap: M,
    readonly keys: StorageMapKeys<M>,
    readonly block?: Block,
  ) {
    super();
  }

  read(): Read<this> {
    return new Read(this);
  }
}
