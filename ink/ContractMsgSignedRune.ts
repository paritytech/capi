import { Chain, ClientRune } from "../fluent/mod.ts"
import { Rune } from "../rune/mod.ts"

export class ContractMsgSigned<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: ContractMsgSigned<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }
}
