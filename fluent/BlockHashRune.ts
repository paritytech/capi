import { Rune, ValueRune } from "../rune/mod.ts"
import { HexHash } from "../util/branded.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./client.ts"
import { Events, EventsRune } from "./EventsRune.ts"
import { chain } from "./rpc_known_methods.ts"

export class BlockHashRune<out U, out C extends Chain = Chain> extends Rune<HexHash, U> {
  constructor(_prime: BlockHashRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  block() {
    return chain
      .getBlock(this.client, this)
      .into(BlockRune, this.client)
  }

  events() {
    return this.client
      .metadata()
      .pallet("System")
      .storage("Events")
      .entry([], this.into(ValueRune))
      .unsafeAs<Events<C["runtimeEvent"]>>()
      .into(EventsRune, this.client)
  }
}
