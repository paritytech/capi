import { hex } from "../crypto/mod.ts"
import { MetaRune } from "../mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"
import { PatternRune } from "./PatternRune.ts"

/** a rune representing a signed extrinsic of the current chain */
export class SignedExtrinsicRune<out C extends Chain, out U> extends PatternRune<Uint8Array, C, U> {
  /** hydrate a `SignedExtrinsicRune` from some corresponding bytes and a `ChainRune` */
  static from<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[value]: RunicArgs<X, [value: Uint8Array]>
  ): SignedExtrinsicRune<C, U | RunicArgs.U<X>> {
    return Rune.resolve(value).into(SignedExtrinsicRune, chain)
  }

  /** hydrate a `SignedExtrinsicRune` from the corresponding hex encoding and `ChainRune` */
  static fromHex<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[value]: RunicArgs<X, [value: string]>
  ): SignedExtrinsicRune<C, U | RunicArgs.U<X>> {
    return this.from(chain, Rune.resolve(value).map(hex.decode))
  }

  /** get a rune representing the call of the current signed extrinsic */
  call() {
    return this.chain.$extrinsic
      .decoded(this.as(SignedExtrinsicRune))
      .access("call")
      .unsafeAs<any>()
      .into(ExtrinsicRune, this.chain)
  }

  /** get the hex representation of the current signed extrinsic */
  hex() {
    return this.into(ValueRune).map(hex.encode)
  }

  /**
   * Get a Rune representing a submitted extrinsic, from which you can access relevant
   * data, such as finalization hash and events.
   */
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
