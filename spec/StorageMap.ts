import { Codec } from "../_deps/scale.ts";
import { Block } from "./Block.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";

export class StorageMap<
  Keys extends unknown[] = unknown[],
  Value extends unknown = unknown,
> extends NodeBase {
  readonly kind = NodeKind.StorageMap;

  constructor(
    readonly pallet: Pallet,
    readonly mapName: string,
    readonly keysCodec?: [...{ [Key in keyof Keys]: Codec<Keys[Key]> }],
    readonly valueCodec?: Codec<Value>,
  ) {
    super();
  }
}
