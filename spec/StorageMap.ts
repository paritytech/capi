import { Codec } from "../_deps/scale.ts";
import { Block } from "./Block.ts";
import { NodeBase, NodeKind } from "./Node.ts";
import { Pallet } from "./Pallet.ts";
import { StorageMapKeysPage } from "./StorageMapKeysPage.ts";
import { StorageMapValue } from "./StorageMapValue.ts";

export class StorageMap<
  Keys extends unknown[] = any[],
  Value extends unknown = any,
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

  get(keys: Keys, block?: Block): StorageMapValue<this> {
    return new StorageMapValue(this, keys as StorageMapKeys<this>, block);
  }

  keys(count: number, offset?: number, block?: Block): StorageMapKeysPage<this> {
    return new StorageMapKeysPage(this, count, offset, block);
  }
}

export type StorageMapKeys<M extends StorageMap> = M extends StorageMap<infer Keys, any> ? Keys
  : never;
