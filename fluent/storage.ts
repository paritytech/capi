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
      storageEntry: this.into(),
    }).map(M.$storageKey).into(CodecRune)
    this.$value = this.pallet.metadata.codec(this.into(ValueRune).access("value"))
  }

  $key
  $value

  entryRaw<X>(...[key, blockHash]: RunicArgs<X, [key: K, blockHash?: U.HexHash]>) {
    const storageKey = this.$key.encoded(key).map(U.hex.encode)
    return state
      .getStorage(this.pallet.metadata.client, storageKey, blockHash)
      .unhandle(null)
  }

  entry<X>(...[key, blockHash]: RunicArgs<X, [key: K, blockHash?: U.HexHash]>) {
    const valueHex = this.entryRaw(key, blockHash)
    return this.$value.decoded(valueHex.map(U.hex.decode)).unsafeAs<V>().into(ValueRune)
  }

  keyPage<X>(
    ...[count, partialKey, start, blockHash]: RunicArgs<X, [
      count: number,
      partialKey?: unknown[],
      start?: unknown[],
      blockHash?: U.HexHash,
    ]>
  ) {
    const storageKey = this.$key.encoded(
      Rune.resolve(partialKey).map((x) => x ?? []),
    ).map(U.hex.encode)
    const startKey = Rune.captureUnhandled(
      [this.$key, start],
      (codec, start) =>
        codec.into(CodecRune)
          .encoded(start.unhandle(undefined))
          .map(U.hex.encode)
          .handle(undefined),
    )
    Rune.tuple([this.$key, start]).map(([codec, key]) => key && U.hex.encode(codec.encode(key)))
    const keysEncoded = state.getKeysPaged(
      this.pallet.metadata.client,
      storageKey,
      count,
      startKey,
      blockHash,
    )
    return Rune.tuple([this.$key, keysEncoded])
      .map(([$key, keysEncoded]) => {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decode(U.hex.decode(keyEncoded))
        })
      })
      .unsafeAs<K[]>()
      .into(ValueRune)
  }

  private _asCodegenStorage<K extends unknown[], V extends unknown>(
    _$key: $.Codec<K>,
    _$value: $.Codec<V>,
  ) {
    return this as any as StorageRune<K, V, never>
  }
}
