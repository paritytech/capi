import { ss58 } from "../crypto/mod.ts"
import { Rune } from "../rune/mod.ts"
import { AddressPrefixChain, ChainRune } from "./ChainRune.ts"
import { Ss58Rune } from "./Ss58Rune.ts"

export class PublicKeyRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: PublicKeyRune<U>["_prime"]) {
    super(_prime)
  }

  ss58<C extends AddressPrefixChain, U>(chain: ChainRune<C, U>) {
    return Rune
      .fn(ss58.encode)
      .call(chain.addressPrefix(), this.as(PublicKeyRune))
      .into(Ss58Rune, chain)
  }
}
