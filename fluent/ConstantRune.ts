import { ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class ConstantRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out K extends Chain.ConstantName<C, P>,
  out U,
> extends PatternRune<Chain.Constant<C, P, K>, C, U> {
  $value = this
    .into(ValueRune)
    .access("codec")
    .into(CodecRune<Chain.Constant.Value<C, P, K>, U>)
  decoded = this.$value.decoded(this.into(ValueRune).access("value"))
}
