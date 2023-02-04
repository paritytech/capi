import { BlockHashRune } from "./BlockHashRune.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { InBlockBlockRune } from "./InBlockBlockRune.ts"

export class InBlockBlockHashRune<out U, out C extends Chain = Chain> extends BlockHashRune<U, C> {
  constructor(_prime: InBlockBlockHashRune<U, C>["_prime"], client: ClientRune<U, C>) {
    super(_prime, client)
  }

  override block() {
    return super.block().into(InBlockBlockRune, this.client)
  }
}
