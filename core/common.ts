export type NodeKind =
  | "Address"
  | "Addresses"
  | "Block"
  | "Call"
  | "Chain"
  | "Entry"
  | "Extrinsic"
  | "Head"
  | "KeyPage"
  | "Metadata"
  | "Pallet"
  | "Signed";

export abstract class NodeBase<Kind extends NodeKind> {
  constructor(readonly kind: Kind) {}
}
