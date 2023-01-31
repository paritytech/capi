import * as M from "../frame_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { TransactionStatus } from "../rpc/known/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Era, era } from "../scale_info/mod.ts"
import { HexHash } from "../util/branded.ts"
import { Blake2_256 } from "../util/hashers.ts"
import * as U from "../util/mod.ts"
import { ClientRune } from "./client.ts"
import { CodecRune } from "./codec.ts"
import { author, chain, payment, system } from "./rpc_known_methods.ts"

export interface EventsBearer {
  events: Event[]
}

export class EventsRune<out U> extends Rune<EventsBearer, U> {
  constructor(_prime: EventsRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
  }
}
