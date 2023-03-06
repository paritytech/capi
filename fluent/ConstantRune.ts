import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PalletRune } from "./PalletRune.ts"

export class ConstantRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out K extends Chain.ConstantName<C, P>,
  out U,
> extends Rune<Chain.Constant<C, P, K>, U> {
  $value
  decoded

  constructor(_prime: ConstantRune<C, P, K, U>["_prime"], readonly pallet: PalletRune<C, P, U>) {
    super(_prime)
    this.$value = this.into(ValueRune).access("codec").into(
      CodecRune<Chain.Constant.Value<C, P, K>, U>,
    )
    this.decoded = this.$value.decoded(this.into(ValueRune).access("value"))
  }
}
