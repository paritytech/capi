import { Client } from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { ss58 } from "../util/mod.ts"
import { AddressRune } from "./AddressRune.ts"
import { ClientRune } from "./ClientRune.ts"

export class PublicKeyRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: PublicKeyRune<U>["_prime"]) {
    super(_prime)
  }

  address<X>(...args: RunicArgs<X, [client: Client]>) {
    const client = RunicArgs.resolve(args)[0].into(ClientRune)
    return Rune
      .tuple([client.addressPrefix(), this.into(ValueRune)])
      .map(([prefix, publicKey]) => ss58.encode(prefix, publicKey))
      .into(AddressRune, client)
  }
}
