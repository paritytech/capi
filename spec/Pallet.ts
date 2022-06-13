import { Codec } from "../_deps/scale.ts";
import { Block } from "./Block.ts";
import { Chain } from "./Chain.ts";
import { ExtrinsicFactory } from "./ExtrinsicFactory.ts";
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

  storageMap<
    Keys extends unknown[] = any[],
    Value extends unknown = any,
  >(
    mapName: string,
    keysCodec?: [...{ [Key in keyof Keys]: Codec<Keys[Key]> }],
    valueCodec?: Codec<Value>,
  ): StorageMap<Keys, Value> {
    return new StorageMap(this, mapName, keysCodec as any, valueCodec as any);
  }

  extrinsicFactory<CallData extends Record<string, unknown> = Record<string, any>>(
    methodName: string,
    callDataCodec?: Codec<CallData>,
  ): ExtrinsicFactory<CallData> {
    return new ExtrinsicFactory(this, methodName, callDataCodec);
  }
}
