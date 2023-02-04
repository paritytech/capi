import { Rune } from "../rune/Rune.ts"
import { HexHash } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export class FinalizedBlockRune<out U, out C extends Chain = Chain> extends BlockRune<U, C> {
  constructor(
    _prime: BlockRune<U, C>["_prime"],
    client: ClientRune<U, C>,
    hash?: Rune<HexHash | undefined, U>,
  ) {
    super(_prime, client, hash)
  }
}
