import { Rune, ValueRune } from "../rune/mod.ts"
import { ss58 } from "../util/mod.ts"
import { AddressRune } from "./AddressRune.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export class PublicKeyRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: PublicKeyRune<U>["_prime"]) {
    super(_prime)
  }

  address<U, C extends Chain>(client: ClientRune<U, C>) {
    return Rune
      .tuple([client.addressPrefix(), this.into(ValueRune)])
      .map(([prefix, publicKey]) => ss58.encode(prefix, publicKey))
      .into(AddressRune, client)
  }
}
