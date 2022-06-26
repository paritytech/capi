import { EnsureLookup } from "../util/mod.ts";
import { NodeBase, NodeKind } from "./common.ts";

import { Address } from "./Address.ts";
import { Addresses } from "./Addresses.ts";
import { Block } from "./Block.ts";
import { Call } from "./Call.ts";
import { Chain } from "./Chain.ts";
import { Entry } from "./Entry.ts";
import { Extrinsic } from "./Extrinsic.ts";
import { Header } from "./Header.ts";
import { KeyPage } from "./KeyPage.ts";
import { Metadata } from "./Metadata.ts";
import { Pallet } from "./Pallet.ts";
import { Signed } from "./Signed.ts";

export type Node = NodeByKind[NodeKind];
export type NodeByKind = EnsureLookup<NodeKind, NodeBase<NodeKind>, {
  Address: Address;
  Addresses: Addresses;
  Block: Block;
  Call: Call;
  Chain: Chain;
  Entry: Entry;
  Extrinsic: Extrinsic;
  Header: Header;
  KeyPage: KeyPage;
  Metadata: Metadata;
  Pallet: Pallet;
  Signed: Signed;
}>;

export * from "./Address.ts";
export * from "./Block.ts";
export * from "./Call.ts";
export * from "./Chain.ts";
export * from "./Entry.ts";
export * from "./Extrinsic.ts";
export * from "./Header.ts";
export * from "./KeyPage.ts";
export * from "./Metadata.ts";
export * from "./Pallet.ts";
export * from "./Signed.ts";
