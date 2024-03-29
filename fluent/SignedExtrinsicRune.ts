import { hex } from "../crypto/mod.ts"
import { MetaRune } from "../mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class SignedExtrinsicRune<in out C extends Chain, out U>
  extends PatternRune<Uint8Array, C, U>
{
  static from<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[value]: RunicArgs<X, [value: Uint8Array]>
  ): SignedExtrinsicRune<C, U | RunicArgs.U<X>> {
    return Rune.resolve(value).into(SignedExtrinsicRune, chain)
  }

  static fromHex<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[value]: RunicArgs<X, [value: string]>
  ): SignedExtrinsicRune<C, U | RunicArgs.U<X>> {
    return this.from(chain, Rune.resolve(value).map(hex.decode))
  }

  call() {
    return this.chain.$extrinsic
      .decoded(this.as(Rune))
      .access("call")
      .unsafeAs<any>()
      .into(ExtrinsicRune, this.chain)
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
      .into(MetaRune)
      .asOrtho()
      .pin(this.chain.connection)
      .into(ExtrinsicStatusRune, this.chain, this)
  }
}
