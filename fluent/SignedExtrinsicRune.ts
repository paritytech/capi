import { hex } from "../crypto/mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"

export class SignedExtrinsicRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: SignedExtrinsicRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
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
