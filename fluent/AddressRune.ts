import { Client } from "../rpc/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { ss58 } from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { PublicKeyRune } from "./PublicKeyRune.ts"

export class AddressRune<out U, out C extends Chain = Chain> extends Rune<string, U> {
  constructor(_prime: AddressRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  static from<X>(...[address, client]: RunicArgs<X, [address: string, client: Client]>) {
    return Rune.resolve(address).into(AddressRune, Rune.resolve(client).into(ClientRune))
  }

  publicKey() {
    return this
      .into(ValueRune)
      .map(ss58.decode)
      .access(1)
      .into(PublicKeyRune)
  }
}
