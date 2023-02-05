import { Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { ss58 } from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export class AddressRune<out U, out C extends Chain = Chain> extends Rune<string, U> {
  constructor(_prime: AddressRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  publicKey() {
    return this.into(ValueRune).map(ss58.decode)
  }
}
