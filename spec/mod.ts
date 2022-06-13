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
export * from "./Extrinsic.ts";
export * from "./ExtrinsicFactory.ts";
export * from "./Metadata.ts";
export * from "./Pallet.ts";
export * from "./StorageItem.ts";
export * from "./StorageMap.ts";
export * from "./StorageMapKeysPage.ts";

class _TODO extends NodeBase {
  readonly kind = undefined!;
}

type NodeLookup = EnsureLookup<NodeKind, NodeBase, {
  Access: _TODO;
  Block: Block;
  Chain: Chain;
  Event: _TODO;
  Extrinsic: _TODO;
  ExtrinsicFactory: _TODO;
  Metadata: Metadata;
  Pallet: Pallet;
  Read: _TODO;
  SignedExtrinsic: _TODO;
  StorageItem: StorageItem;
  StorageMap: StorageMap;
  StorageMapKeysPage: _TODO;
  StorageMapValue: _TODO;
  StoragePath: _TODO;
  Subscribe: _TODO;
}>;

export type Node<Kind extends NodeKind = NodeKind> = NodeLookup[Kind];
