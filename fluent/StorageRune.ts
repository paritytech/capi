import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { hex, HexHash } from "../util/mod.ts"
import { CodecRune } from "./CodecRune.ts"
import { PalletRune } from "./PalletRune.ts"

export class StorageRune<in out K extends unknown[], out V, out U> extends Rune<M.StorageEntry, U> {
  $key
  $value

  constructor(_prime: StorageRune<K, V, U>["_prime"], readonly pallet: PalletRune<U>) {
    super(_prime)
    this.$key = Rune.rec({
      deriveCodec: this.pallet.metadata.deriveCodec,
      pallet: this.pallet,
      storageEntry: this.as(Rune),
    }).map(M.$storageKey).into(CodecRune)
    this.$value = this.pallet.metadata.codec(this.into(ValueRune).access("value"))
  }

  entryPageRaw<X>(
    ...[count, partialKey, start, blockHash]: RunicArgs<X, [
      count: number,
      partialKey?: unknown[],
      start?: unknown[],
      blockHash?: HexHash,
    ]>
  ) {
    const storageKeys = this.keyPageRaw(count, partialKey, start, blockHash)
    return this.pallet.metadata.chain.connection.call(
      "state_queryStorageAt",
      storageKeys,
      blockHash,
    )
  }

  entryPage<X>(
    ...[count, partialKey, start, blockHash]: RunicArgs<X, [
      count: number,
      partialKey?: unknown[],
      start?: unknown[],
      blockHash?: HexHash,
    ]>
  ) {
    return Rune
      .tuple([this.entryPageRaw(count, partialKey, start, blockHash), this.$key, this.$value])
      .map(([changeset, $key, $value]) => {
        return changeset.map(({ changes }) =>
          changes.map(([k, v]) => {
            return [$key.decode(hex.decode(k)), v ? $value.decode(hex.decode(v)) : undefined]
          })
        )
      })
      // TODO: why wrapped within the array? Is this consistently a 1-element tuple?
      .unsafeAs<[K, V][][]>()
  }

  entryRaw<X>(...[key, blockHash]: RunicArgs<X, [key: K, blockHash?: HexHash]>) {
    const storageKey = this.$key.encoded(key).map(hex.encode)
    return this.pallet.metadata.chain.connection
      .call("state_getStorage", storageKey, blockHash)
      .unhandle(null)
      .rehandle(null, () => Rune.constant(undefined))
  }

  entry<X>(...[key, blockHash]: RunicArgs<X, [key: K, blockHash?: HexHash]>) {
    return this.$value
      .decoded(this.entryRaw(key, blockHash).unhandle(undefined).map(hex.decode))
      .unsafeAs<V>()
      .into(ValueRune)
      .rehandle(undefined)
  }

  keyPageRaw<X>(
    ...[count, partialKey, start, blockHash]: RunicArgs<X, [
      count: number,
      partialKey?: unknown[],
      start?: unknown[],
      blockHash?: HexHash,
    ]>
  ) {
    const storageKey = this.$key
      .encoded(Rune.resolve(partialKey).map((x) => x ?? []))
      .map(hex.encode)
    const startKey = Rune.captureUnhandled(
      [this.$key, start],
      (codec, start) =>
        codec.into(CodecRune)
          .encoded(start.unhandle(undefined))
          .map(hex.encode)
          .rehandle(undefined),
    )
    return this.pallet.metadata.chain.connection.call(
      "state_getKeysPaged",
      storageKey,
      count,
      startKey,
      blockHash,
    )
  }

  keyPage<X>(
    ...[count, partialKey, start, blockHash]: RunicArgs<X, [
      count: number,
      partialKey?: unknown[],
      start?: unknown[],
      blockHash?: HexHash,
    ]>
  ) {
    const raw = this.keyPageRaw(count, partialKey, start, blockHash)
    return Rune.tuple([this.$key, raw])
      .map(([$key, raw]) => raw.map((keyEncoded) => $key.decode(hex.decode(keyEncoded))))
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
