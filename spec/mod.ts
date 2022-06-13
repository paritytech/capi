import { EnsureLookup } from "../util/mod.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { Metadata } from "./Metadata.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";
import { StorageItem } from "./StorageItem.ts";
import { StorageMap } from "./StorageMap.ts";

export * from "./Block.ts";
export * from "./Chain.ts";
export * from "./Metadata.ts";
export * from "./Pallet.ts";
export * from "./StorageItem.ts";
export * from "./StorageMap.ts";

class _TODO extends NodeBase {
  readonly kind = undefined!;
}

type NodeLookup = EnsureLookup<NodeKind, NodeBase, {
  Chain: Chain;
  Access: _TODO;
  Metadata: Metadata;
  Block: Block;
  Event: _TODO;
  Pallet: Pallet;
  Read: _TODO;
  StorageItem: StorageItem;
  StorageMap: StorageMap;
  StorageMapKey: _TODO;
  StorageMapValue: _TODO;
  StoragePath: _TODO;
  Subscribe: _TODO;
  Transaction: _TODO;
}>;

export type Node<Kind extends NodeKind = NodeKind> = NodeLookup[Kind];
