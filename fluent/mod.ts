import * as C from "../mod.ts"
import { Args, Rune } from "../rune/mod.ts"
import * as U from "../util/mod.ts"

export * from "./Contract.ts"
export * from "./Multisig.ts"

export class Storage<K extends unknown[], V> {
  constructor(
    readonly client: Rune<C.rpc.Client>,
    readonly type: C.frame.StorageEntry["type"],
    readonly modifier: C.frame.StorageEntry["modifier"],
    readonly pallet: string,
    readonly name: string,
    readonly $key: C.$.Codec<K>,
    readonly $value: C.$.Codec<V>,
  ) {}

  entry<X>(...key: Args<X, K>): StorageEntry<K, V, X> {
    return new StorageEntry(this, key)
  }

  keys<X>(...partialKey: Args<X, Partial<K>>): StorageKeys<K, V, X> {
    return new StorageKeys(this, partialKey)
  }
}

export class StorageEntry<K extends unknown[], V, X> {
  constructor(readonly storage: Storage<K, V>, readonly key: Args<X, K>) {}

  read<X>(...[hash]: Args<X, [hash?: U.HexHash]>) {
    return C.entryRead(this.storage.client)(
      this.storage.pallet,
      this.storage.name,
      this.key,
      hash,
    ).pipe((x) => x as V)
  }
}
export class StorageKeys<K extends unknown[], V, X> {
  constructor(readonly storage: Storage<K, V>, readonly partialKey: Args<X, Partial<K>>) {}

  // readPage<
  //   Count extends C.Z.$<number>,
  //   Rest extends [start?: C.Z.Ls$<K>, blockHash?: C.Z.$<U.HexHash | undefined>],
  // >(count: Count, ...rest: Rest) {
  //   return C.keyPageRead(this.storage.client)<
  //     string,
  //     string,
  //     Count,
  //     PartialKey,
  //     Rest
  //   >(
  //     this.storage.pallet,
  //     this.storage.name,
  //     count,
  //     this.partialKey as [...PartialKey],
  //     ...rest,
  //   ).as<K[]>()
  // }

  //   first<
  //     Rest extends [start?: C.Z.Ls$<K>, blockHash?: C.Z.$<U.HexHash | undefined>],
  //   >(...rest: Rest) {
  //     return this.readPage(1, ...rest).access(0)
  //   }
}
