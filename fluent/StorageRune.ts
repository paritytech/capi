import { hex } from "../crypto/mod.ts"
import { is, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"

/** a rune representing an item or map in storage */
export class StorageRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out S extends Chain.StorageName<C, P>,
  out U,
> extends PatternRune<Chain.Storage<C, P, S>, C, U> {
  $key = this.into(ValueRune).access("key").unsafeAs<any>().into(
    CodecRune<Chain.Storage.Key<C, P, S>, Chain.Storage.Key<C, P, S>, U>,
  )
  $partialKey = this.into(ValueRune).access("partialKey").unsafeAs<any>().into(
    CodecRune<Chain.Storage.PartialKey<C, P, S>, Chain.Storage.PartialKey<C, P, S>, U>,
  )
  $value = this.into(ValueRune).access("value").unsafeAs<any>().into(
    CodecRune<Chain.Storage.Value<C, P, S>, Chain.Storage.Value<C, P, S>, U>,
  )

  /** Get a rune representing the scale-encoded value of the current storage */
  valueRaw<X>(
    ...[key, blockHash]: RunicArgs<X, [
      key: Chain.Storage.Key<C, P, S>,
      blockHash?: string,
    ]>
  ) {
    const storageKey = this.$key.encoded(key).map(hex.encodePrefixed)
    return this.chain.connection
      .call("state_getStorage", storageKey, this.chain.blockHash(blockHash))
      .handle(is(null), () => Rune.constant(undefined))
  }

  /** Get a rune representing the value of the current storage */
  value<X>(
    ...[key, blockHash]: RunicArgs<X, [
      key: Chain.Storage.Key<C, P, S>,
      blockHash?: string,
    ]>
  ) {
    return this.$value
      .decoded(this.valueRaw(key, blockHash).unhandle(is(undefined)).map(hex.decode))
      .into(ValueRune)
      .rehandle(is(undefined))
  }

  /** Get a rune representing the size of the current storage */
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
        this.chain.blockHash(blockHash),
      )
      .handle(is(null), () => Rune.constant(undefined))
  }

  /** Get a rune representing the default value of the current storage */
  default() {
    return this.$value
      .decoded(this.into(ValueRune).access("default").unhandle(is(undefined)))
      .rehandle(is(undefined))
  }

  /** Get a rune representing scale-encoded storage entries */
  entriesRaw<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    const storageKeys = this.keysRaw(props, blockHash)
    return this.chain.connection.call(
      "state_queryStorageAt",
      storageKeys,
      this.chain.blockHash(blockHash),
    )
  }

  /** Get a rune representing storage entries */
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

  /** Get a rune representing scale-encoded storage keys */
  keysRaw<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    const storageKey = this.$partialKey.encoded(
      Rune.resolve("partialKey" in props ? props.partialKey : null).unsafeAs(),
    )
      .map(hex.encodePrefixed)
    const startKey = this.$key
      .encoded(Rune.resolve(props.start).unhandle(is(undefined)).unsafeAs())
      .map(hex.encodePrefixed)
      .rehandle(is(undefined))
    return this.chain.connection.call(
      "state_getKeysPaged",
      storageKey,
      Rune.resolve(props.limit).handle(is(undefined), () => Rune.constant(100)),
      startKey,
      this.chain.blockHash(blockHash),
    )
  }

  /** Get a rune representing storage keys */
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

/** properties one can use to specify pagination to storage rune factories */
export interface StoragePageProps<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out S extends Chain.StorageName<C, P>,
> {
  /** the maximum number of items to include in the page */
  limit?: number
  /** the partial key with which to match items */
  partialKey?: Chain.Storage.PartialKey<C, P, S>
  /** the key at which to begin retrieval */
  start?: Chain.Storage.Key<C, P, S>
}
