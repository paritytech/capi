import { BlockHashRune } from "./BlockHashRune.ts"
import { Chain, ClientRune } from "./client.ts"
import { FinalizedBlockRune } from "./FinalizedBlockRune.ts"

export class FinalizedBlockHashRune<out U, out C extends Chain = Chain>
  extends BlockHashRune<U, C>
{
  constructor(_prime: FinalizedBlockHashRune<U, C>["_prime"], client: ClientRune<U, C>) {
    super(_prime, client)
  }

  override block(): FinalizedBlockRune<U, C> {
    return super.block().as(FinalizedBlockRune, this.client)
  }
}
