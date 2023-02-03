import { ValueRune } from "../rune/ValueRune.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./client.ts"
import { Events, EventsRune } from "./EventsRune.ts"
import { chain } from "./rpc_known_methods.ts"

export class FinalizedBlockRune<out U, out C extends Chain = Chain> extends BlockRune<U, C> {
  number
  hash
  metadata

  constructor(_prime: FinalizedBlockRune<U, C>["_prime"], client: ClientRune<U, C>) {
    super(_prime, client)
    this.number = this.into(ValueRune).access("block", "header", "number")
    this.hash = chain.getBlockHash(this.client, this.number)
    this.metadata = this.client.metadata(this.hash)
  }

  events() {
    return this.metadata
      .pallet("System")
      .storage("Events")
      .entry([])
      .unsafeAs<Events<C["runtimeEvent"]>>()
      .into(EventsRune)
  }
}
