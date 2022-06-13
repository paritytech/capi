import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { StorageItem } from "./StorageItem.ts";
import { StorageMap } from "./StorageMap.ts";

export class Pallet extends NodeBase {
  readonly kind = NodeKind.Pallet;

  constructor(
    readonly chain: Chain,
    readonly name: string,
  ) {
    super();
  }

  storageItem(entryName: string, block?: Block): StorageItem {
    return new StorageItem(this, entryName, block);
  }

  storageMap(mapName: string): StorageMap {
    return new StorageMap(this, mapName);
  }
}
