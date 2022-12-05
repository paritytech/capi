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

  keys<PartialKey extends C.Z.Ls$<Partial<K>>>(
    ...partialKey: PartialKey
  ): StorageKeys<C, K, V, PartialKey> {
    return new StorageKeys(this, partialKey)
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
export class StorageKeys<
  C extends C.Z.$<C.rpc.Client>,
  K extends unknown[],
  V,
  PartialKey extends C.Z.Ls$<Partial<K>>,
> {
  constructor(readonly storage: Storage<C, K, V>, readonly partialKey: PartialKey) {}

  readPage<
    Count extends C.Z.$<number>,
    Rest extends [start?: C.Z.Ls$<K>, blockHash?: C.Z.$<U.HexHash | undefined>],
  >(count: Count, ...rest: Rest) {
    return C.keyPageRead(this.storage.client)<
      string,
      string,
      Count,
      PartialKey,
      Rest
    >(
      this.storage.pallet,
      this.storage.name,
      count,
      this.partialKey as [...PartialKey],
      ...rest,
    ).as<K[]>()
  }

  first<
    Rest extends [start?: C.Z.Ls$<K>, blockHash?: C.Z.$<U.HexHash | undefined>],
  >(...rest: Rest) {
    return this.readPage(1, ...rest).access(0)
  }
}
