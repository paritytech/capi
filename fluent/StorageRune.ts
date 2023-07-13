import { hex } from "../crypto/mod.ts"
import { is, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"

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

  default() {
    return this.$value
      .decoded(this.into(ValueRune).access("default").unhandle(is(undefined)))
      .rehandle(is(undefined))
  }

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

  entries<X, Y>(
    props: RunicArgs<X, StoragePageProps<C, P, S>>,
    ...[blockHash]: RunicArgs<Y, [blockHash?: string]>
  ) {
    return Rune
      .tuple([this.entriesRaw(props, blockHash).access(0), this.$key, this.$value])
      .map(([changeset, $key, $value]) =>
        changeset
          ? changeset.changes.map(([k, v]) => [
            $key.decode(hex.decode(k)),
            v ? $value.decode(hex.decode(v)) : undefined,
          ])
          : []
      )
      .unsafeAs<[Chain.Storage.Key<C, P, S>, Chain.Storage.Value<C, P, S>][]>()
      .into(ValueRune)
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
  limit?: number
  partialKey?: Chain.Storage.PartialKey<C, P, S>
  start?: Chain.Storage.Key<C, P, S>
}
