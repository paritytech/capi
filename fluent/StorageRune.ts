import { hex } from "../crypto/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class StorageRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out S extends Chain.StorageName<C, P>,
  out U,
> extends PatternRune<Chain.Storage<C, P, S>, C, U> {
  $key = this.into(ValueRune).access("key").into(CodecRune<Chain.Storage.Key<C, P, S>, U>)
  $partialKey = this.into(ValueRune).access("partialKey").into(
    CodecRune<Chain.Storage.PartialKey<C, P, S>, U>,
  )
  $value = this.into(ValueRune).access("value").into(CodecRune<Chain.Storage.Value<C, P, S>, U>)

  valueRaw<X>(
    ...[key, blockHash]: RunicArgs<X, [
      key: Chain.Storage.Key<C, P, S>,
      blockHash?: string,
    ]>
  ) {
    const storageKey = this.$key.encoded(key).map(hex.encodePrefixed)
    return this.chain.connection
      .call("state_getStorage", storageKey, blockHash)
      .unhandle(null)
      .rehandle(null, () => Rune.constant(undefined))
  }

  value<X>(
    ...[key, blockHash]: RunicArgs<X, [
      key: Chain.Storage.Key<C, P, S>,
      blockHash?: string,
    ]>
  ) {
    return this.$value
      .decoded(this.valueRaw(key, blockHash).unhandle(undefined).map(hex.decode))
      .into(ValueRune)
      .rehandle(undefined)
  }

  size<X>(
    ...[partialKey, blockHash]: RunicArgs<X, [
      partialKey: Chain.Storage.PartialKey<C, P, S>,
      blockHash?: string,
    ]>
  ) {
    return this.chain.connection
      .call(
        "state_getStorageSize",
        this.$partialKey.encoded(partialKey).map(hex.encodePrefixed),
        blockHash,
      )
      .unhandle(null)
      .rehandle(null, () => Rune.constant(undefined))
  }

  default() {
    return this.$value
      .decoded(this.into(ValueRune).access("default").unhandle(undefined))
      .rehandle(undefined)
  }

  entriesRaw<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    const storageKeys = this.keysRaw(props, blockHash)
    return this.chain.connection.call("state_queryStorageAt", storageKeys, blockHash)
  }

  entries<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    return Rune
      .tuple([this.entriesRaw(props, blockHash).access(0), this.$key, this.$value])
      .map(([changeset, $key, $value]) =>
        changeset!.changes.map(([k, v]) => [
          $key.decode(hex.decode(k)),
          v ? $value.decode(hex.decode(v)) : undefined,
        ])
      )
      .unsafeAs<[Chain.Storage.Key<C, P, S>, Chain.Storage.Value<C, P, S>][]>()
  }

  keysRaw<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    const storageKey = this.$partialKey.encoded(
      Rune.resolve("partialKey" in props ? props.partialKey : null).unsafeAs(),
    )
      .map(hex.encodePrefixed)
    const startKey = this.$key
      .encoded(Rune.resolve(props.start).unhandle(undefined))
      .map(hex.encodePrefixed)
      .rehandle(undefined)
    return this.chain.connection.call(
      "state_getKeysPaged",
      storageKey,
      Rune.resolve(props.count).handle(undefined, () => Rune.constant(100)),
      startKey,
      blockHash,
    )
  }

  keys<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    const raw = this.keysRaw(props, blockHash)
    return Rune.tuple([this.$key, raw])
      .map(([$key, raw]) => raw.map((keyEncoded) => $key.decode(hex.decode(keyEncoded))))
      .into(ValueRune)
  }
}

export interface StoragePageProps<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out S extends Chain.StorageName<C, P>,
> {
  count?: number
  partialKey?: Chain.Storage.PartialKey<C, P, S>
  start?: Chain.Storage.Key<C, P, S>
}
