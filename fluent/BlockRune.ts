import { known } from "../rpc/mod.ts"
import { Rune } from "../rune/mod.ts"
import { Chain, ClientRune } from "./client.ts"

export class BlockRune<out U, out C extends Chain = Chain> extends Rune<known.SignedBlock, U> {
  constructor(_prime: BlockRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }
}
