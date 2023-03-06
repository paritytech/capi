import { hex } from "../crypto/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PalletRune } from "./PalletRune.ts"

export class StorageRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out S extends Chain.StorageName<C, P>,
  out U,
> extends Rune<Chain.Storage<C, P, S>, U> {
  $key
  $value

  constructor(_prime: StorageRune<C, P, S, U>["_prime"], readonly pallet: PalletRune<C, P, U>) {
    super(_prime)
    this.$key = this.into(ValueRune).access("key").into(CodecRune<Chain.Storage.Key<C, P, S>, U>)
    this.$value = this.into(ValueRune).access("value").into(
      CodecRune<Chain.Storage.Value<C, P, S>, U>,
    )
  }

  valueRaw<X>(
    ...[key, blockHash]: RunicArgs<X, [
      key: Chain.Storage.Key<C, P, S>,
      blockHash?: string,
    ]>
  ) {
    const storageKey = this.$key.encoded(key).map(hex.encode)
    return this.pallet.chain.connection
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

  // TODO: keyPage, entryPage, size
}
