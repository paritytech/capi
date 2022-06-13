export const enum NodeKind {
  Chain = "Chain",
  Metadata = "Metadata",
  Pallet = "Pallet",
  Block = "Block",
  StorageItem = "StorageItem",
  StorageMap = "StorageMap",
  StorageMapValue = "StorageMapValue",
  Access = "Access",
  Transaction = "Transaction",
  Event = "Event",
  Read = "Read",
  Subscribe = "Subscribe",
}

export abstract class NodeBase {
  abstract readonly kind: NodeKind;
}
