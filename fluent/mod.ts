import * as C from "../mod.ts"
import * as U from "../util/mod.ts"

export class Storage<C extends C.Z.$<C.rpc.Client>, K extends unknown[], V> {
  constructor(
    readonly client: C,
    readonly type: C.M.StorageEntry["type"],
    readonly modifier: C.M.StorageEntry["modifier"],
    readonly pallet: string,
    readonly name: string,
    readonly $key: C.$.Codec<K>,
    readonly $value: C.$.Codec<V>,
  ) {}

  entry<Key extends C.Z.Ls$<K>>(...key: Key): StorageEntry<C, K, V, Key> {
    return new StorageEntry(this, key)
  }
}

export class StorageEntry<
  C extends C.Z.$<C.rpc.Client>,
  K extends unknown[],
  V,
  Key extends C.Z.Ls$<K>,
> {
  constructor(readonly storage: Storage<C, K, V>, readonly key: Key) {}

  read<MaybeHash extends [blockHash?: C.Z.$<U.HexHash | undefined>]>(...maybeHash: MaybeHash) {
    return C.entryRead(this.storage.client)(
      this.storage.pallet,
      this.storage.name,
      this.key,
      ...maybeHash,
    ).as<{ value: V }>()
  }
}
