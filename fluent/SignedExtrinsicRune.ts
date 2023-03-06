import { hex } from "../crypto/mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"

export class SignedExtrinsicRune<out C extends Chain, out U> extends Rune<Uint8Array, U> {
  constructor(_prime: SignedExtrinsicRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
  }

  hex() {
    return this.into(ValueRune).map(hex.encode)
  }

  sent() {
    return this
      .hex()
      .map((hex) =>
        this.chain.connection.subscribe(
          "author_submitAndWatchExtrinsic",
          "author_unwatchExtrinsic",
          hex,
        )
      )
      .into(ExtrinsicStatusRune, this)
  }
}
