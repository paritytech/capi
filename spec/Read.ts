import { Block } from "./Block.ts";
import { Metadata } from "./Metadata.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { StorageItem } from "./StorageItem.ts";
import { StorageMapKeysPage } from "./StorageMapKeysPage.ts";
import { StorageMapValue } from "./StorageMapValue.ts";

export class Read<Target extends ReadTarget> extends NodeBase {
  readonly kind = NodeKind.Read;

  constructor(readonly target: Target) {
    super();
  }
}

export type ReadTarget = Metadata | Block | StorageItem<any> | StorageMapKeysPage | StorageMapValue;
