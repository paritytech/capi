import { ss58 } from "../crypto/mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { Ss58AddressRune } from "./AddressRune.ts"
import { AddressPrefixChain, ChainRune } from "./ChainRune.ts"

export class PublicKeyRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: PublicKeyRune<U>["_prime"]) {
    super(_prime)
  }

  ss58Address<C extends AddressPrefixChain, U>(chain: ChainRune<C, U>) {
    return Rune
      .tuple([chain.addressPrefix(), this.into(ValueRune)])
      .map(([prefix, publicKey]) => ss58.encode(prefix, publicKey))
      .into(Ss58AddressRune, chain)
  }

  multiaddress() {
    return Rune.rec({
      type: "Id" as const,
      value: this,
    })
  }
}
