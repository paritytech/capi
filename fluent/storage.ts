import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import { Args, Rune } from "../rune/mod.ts"
import * as U from "../util/mod.ts"
import { CodecRune } from "./codec.ts"
import { PalletRune } from "./pallet.ts"
import { state } from "./rpc_known_methods.ts"

export class StorageRune<K extends unknown[], V, out U> extends Rune<M.StorageEntry, U> {
  constructor(_prime: StorageRune<K, V, U>["_prime"], readonly pallet: PalletRune<U>) {
    super(_prime)
    this.$key = Rune.rec({
      deriveCodec: this.pallet.metadata.deriveCodec,
      pallet: this.pallet,
      storageEntry: this.as(),
    }).pipe(M.$storageKey).subclass(CodecRune)
    this.$value = this.pallet.metadata.codec(this.pipe((x) => x.value))
  }

  $key
  $value

  entry<X>(...[key, blockHash]: Args<X, [key: K, blockHash?: U.HexHash]>) {
    const storageKey = this.$key.encoded(key).unwrapError().pipe(U.hex.encode)
    const valueHex = state.getStorage(this.pallet.metadata.client.as(), storageKey, blockHash)
      .unwrapError()
    return this.$value.decoded(valueHex.pipe(U.hex.decode)).as<V>()
  }

  keyPage<X>(
    ...[count, partialKey, start, blockHash]: Args<X, [
      count: number,
      partialKey: unknown[],
      start?: unknown[],
      blockHash?: U.HexHash,
    ]>
  ) {
    const storageKey = this.$key.encoded(partialKey).unwrapError().pipe(U.hex.encode)
    const startKey = this.$key.encoded(Rune.resolve(start).wrapU().unwrapOption()).unwrapError()
      .pipe(U.hex.encode).catch().unwrapError()
    const keysEncoded = state.getKeysPaged(
      this.pallet.metadata.client.as(),
      storageKey,
      count,
      startKey,
      blockHash,
    )
      .unwrapError()
    return Rune.ls([this.$key, keysEncoded])
      .pipe(([$key, keysEncoded]) => {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decode(U.hex.decode(keyEncoded))
        })
      })
  }

  private _asCodegenStorage<K extends unknown[], V extends unknown>(
    _$key: $.Codec<K>,
    _$value: $.Codec<V>,
  ) {
    return this as any as StorageRune<K, V, never>
  }
}
