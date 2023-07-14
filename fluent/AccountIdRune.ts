import { ss58 } from "../crypto/mod.ts"
import { RunicArgs } from "../mod.ts"
import { Rune } from "../rune/mod.ts"
import { AddressPrefixChain, ChainRune } from "./ChainRune.ts"
import { Ss58Rune } from "./Ss58Rune.ts"

/** A rune representing a public key */
export class AccountIdRune<out U> extends Rune<Uint8Array, U> {
  static from<X>(...[accountId]: RunicArgs<X, [accountId: Uint8Array]>) {
    return Rune.resolve(accountId).into(this)
  }

  /** Get an SS58 of the current public key on the specified chain */
  ss58<C extends AddressPrefixChain, U>(chain: ChainRune<C, U>) {
    return Rune
      .fn(ss58.encode)
      .call(chain.addressPrefix(), this.as(AccountIdRune))
      .into(Ss58Rune, chain)
  }
}
