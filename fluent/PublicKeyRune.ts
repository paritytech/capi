import { ss58 } from "../crypto/mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { AddressRune } from "./AddressRune.ts"
import { AddressPrefixChain, ChainRune } from "./ChainRune.ts"

export class PublicKeyRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: PublicKeyRune<U>["_prime"]) {
    super(_prime)
  }

  address<C extends AddressPrefixChain, U>(chain: ChainRune<C, U>) {
    return Rune
      .tuple([chain.addressPrefix(), this.into(ValueRune)])
      .map(([prefix, publicKey]) => ss58.encode(prefix, publicKey))
      .into(AddressRune, chain)
  }
}
