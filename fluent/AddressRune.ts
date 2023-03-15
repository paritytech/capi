import { ss58 } from "../crypto/mod.ts"
import { Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { PublicKeyRune } from "./PublicKeyRune.ts"

export class AddressRune<out C extends Chain, U> extends Rune<string, U> {
  constructor(_prime: AddressRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
  }

  publicKey() {
    return this
      .into(ValueRune)
      .map(ss58.decode)
      .access(1)
      .into(PublicKeyRune)
  }
}
