import { ss58 } from "../crypto/mod.ts"
import { Rune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { HasSystemSs58Prefix } from "./constraints.ts"
import { Ss58Rune } from "./Ss58Rune.ts"

export class PublicKeyRune<out U> extends Rune<Uint8Array, U> {
  ss58<C extends Chain, U>(chain: ChainRune<Chain.Req<C, HasSystemSs58Prefix>, U>) {
    const prefix = chain
      .pallet("System")
      .constant("SS58Prefix")
      .decoded
    return Rune
      .fn(ss58.encode)
      .call(prefix, this.as(PublicKeyRune))
      .into(Ss58Rune, chain)
  }
}
