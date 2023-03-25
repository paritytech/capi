import { ss58 } from "../crypto/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Chain } from "./ChainRune.ts"
import { Ss58Chain } from "./constraints/mod.ts"
import { PatternRune } from "./PatternRune.ts"
import { PublicKeyRune } from "./PublicKeyRune.ts"

export class Ss58Rune<out C extends Chain, U> extends PatternRune<string, Ss58Chain<C>, U> {
  publicKey() {
    return this
      .into(ValueRune)
      .map(ss58.decode)
      .access(1)
      .into(PublicKeyRune)
  }
}
