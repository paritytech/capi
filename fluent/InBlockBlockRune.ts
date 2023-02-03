import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./client.ts"

export class InBlockBlockRune<out U, out C extends Chain = Chain> extends BlockRune<U, C> {
  constructor(_prime: InBlockBlockRune<U, C>["_prime"], client: ClientRune<U, C>) {
    super(_prime, client)
  }
}
