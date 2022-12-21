import * as C from "../mod.ts"
import * as U from "../util/mod.ts"

export function storageEntry<C extends C.Z.$<C.rpc.Client>, V>(
  client: C,
  pallet: string,
  name: string,
  keys: unknown[] = [],
) {
  return Object.assign(<MaybeHash extends [blockHash?: C.Z.$<U.HexHash | undefined>]>(
    ...maybeHash: MaybeHash
  ) => {
    return C.entryRead(client)(pallet, name, keys, ...maybeHash).as<{ value: V }>()
  }, {
    raw<MaybeHash extends [blockHash?: C.Z.$<U.HexHash | undefined>]>(...maybeHash: MaybeHash) {
      return C.entryReadRaw(client)(pallet, name, keys, ...maybeHash)
    },
  })
}

export class StorageMap<C extends C.Z.$<C.rpc.Client>, K extends unknown[], V> {
  constructor(
    readonly client: C,
    readonly pallet: string,
    readonly name: string,
  ) {}

  entry<Key extends C.Z.Ls$<K>>(...key: Key) {
    return {
      read: <MaybeHash extends [blockHash?: C.Z.$<U.HexHash | undefined>]>(
        ...maybeHash: MaybeHash
      ) => {
        return storageEntry(
          this.client,
          this.pallet,
          this.name,
          key,
        )(...maybeHash)
      },
    }
  }

  keys<PartialKey extends C.Z.Ls$<Partial<K>>>(
    ...partialKey: PartialKey
  ): StorageKeys<C, K, V, PartialKey> {
    return new StorageKeys(this, partialKey)
  }
}

export class StorageKeys<
  C extends C.Z.$<C.rpc.Client>,
  K extends unknown[],
  V,
  PartialKey extends C.Z.Ls$<Partial<K>>,
> {
  constructor(readonly storage: StorageMap<C, K, V>, readonly partialKey: PartialKey) {}

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
