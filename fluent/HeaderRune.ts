import { known } from "../rpc/mod.ts"
import { Rune } from "../rune/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export class HeaderRune<out U, out C extends Chain = Chain> extends Rune<known.Header, U> {
  constructor(_prime: HeaderRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }
}
