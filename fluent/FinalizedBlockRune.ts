import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export class FinalizedBlockRune<out U, out C extends Chain = Chain> extends BlockRune<U, C> {
  constructor(_prime: FinalizedBlockRune<U, C>["_prime"], client: ClientRune<U, C>) {
    super(_prime, client)
  }
}
