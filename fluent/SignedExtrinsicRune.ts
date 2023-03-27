import { hex } from "../crypto/mod.ts"
import { ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { HasSystemEvents } from "./constraints.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class SignedExtrinsicRune<out C extends Chain, out U> extends PatternRune<Uint8Array, C, U> {
  hex() {
    return this.into(ValueRune).map(hex.encode)
  }

  sent(this: SignedExtrinsicRune<Chain.Req<C, HasSystemEvents>, U>) {
    return this
      .hex()
      .map((hex) =>
        this.chain.connection.subscribe(
          "author_submitAndWatchExtrinsic",
          "author_unwatchExtrinsic",
          hex,
        )
      )
      .into(ExtrinsicStatusRune, this.chain, this)
  }
}
