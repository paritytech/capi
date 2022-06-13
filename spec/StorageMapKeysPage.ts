import { Block } from "./Block.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Read } from "./Read.ts";
import { StorageMap } from "./StorageMap.ts";

export class StorageMapKeysPage<M extends StorageMap = StorageMap> extends NodeBase {
  readonly kind = NodeKind.StorageMapKeysPage;

  constructor(
    readonly storageMap: M,
    readonly count: number,
    readonly offset?: number,
    readonly block?: Block,
  ) {
    super();
  }

  read(): Read<this> {
    return new Read(this);
  }
}
