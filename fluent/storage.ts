import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
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
    }).map(M.$storageKey).as(CodecRune)
    this.$value = this.pallet.metadata.codec(this.as(ValueRune).access("value"))
  }

  $key
  $value

  entry<X>(...[key, blockHash]: RunicArgs<X, [key: K, blockHash?: U.HexHash]>) {
    const storageKey = this.$key.encoded(key).unwrapError().map(U.hex.encode)
    const valueHex = state.getStorage(this.pallet.metadata.client.as(), storageKey, blockHash)
      .unwrapError()
    return this.$value.decoded(valueHex.map(U.hex.decode)).unsafeAs<V>().as(ValueRune)
  }

  keyPage<X>(
    ...[count, partialKey, start, blockHash]: RunicArgs<X, [
      count: number,
      partialKey: unknown[],
      start?: unknown[],
      blockHash?: U.HexHash,
    ]>
  ) {
    const storageKey = this.$key.encoded(partialKey).unwrapError().map(U.hex.encode)
    const startKey = this.$key.as(ValueRune).wrapU().as(CodecRune).encoded(
      Rune.resolve(start).wrapU().unwrapOption(),
    ).unwrapError().map(U.hex.encode).catch().unwrapError()
    const keysEncoded = state.getKeysPaged(
      this.pallet.metadata.client.as(),
      storageKey,
      count,
      startKey,
      blockHash,
    )
      .unwrapError()
    return Rune.ls([this.$key, keysEncoded])
      .map(([$key, keysEncoded]) => {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decode(U.hex.decode(keyEncoded))
        })
      })
      .unsafeAs<K[]>()
      .as(ValueRune)
  }

  private _asCodegenStorage<K extends unknown[], V extends unknown>(
    _$key: $.Codec<K>,
    _$value: $.Codec<V>,
  ) {
    return this as any as StorageRune<K, V, never>
  }
}
