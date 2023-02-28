import { ss58 } from "../crypto/mod.ts"
import { Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { PublicKeyRune } from "./PublicKeyRune.ts"

export class AddressRune<out U, out C extends Chain = Chain> extends Rune<string, U> {
  constructor(_prime: AddressRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
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
