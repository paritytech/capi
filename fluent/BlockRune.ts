import { hex } from "../crypto/mod.ts"
import { $extrinsic } from "../frame_metadata/Extrinsic.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { Event, EventsChain, EventsRune } from "./EventsRune.ts"

export class BlockRune<out C extends Chain, out U> extends Rune<known.SignedBlock, U> {
  constructor(
    _prime: BlockRune<C, U>["_prime"],
    readonly chain: ChainRune<C, U>,
    readonly hash: Rune<string, U>,
  ) {
    super(_prime)
  }

  header() {
    return this.into(ValueRune).access("block", "header")
  }

  extrinsicsRaw() {
    return this.into(ValueRune).access("block", "extrinsics")
  }

  extrinsics() {
    const $ext = Rune.fn($extrinsic)
      .call(this.chain.metadata, null!)
      .into(CodecRune)
    return this
      .extrinsicsRaw()
      .into(ArrayRune)
      .mapArray((h) => $ext.decoded(h.map(hex.decode)))
  }

  events(this: BlockRune<EventsChain<C>, U>) {
    return this.chain
      .pallet("System")
      .storage("Events")
      .value(undefined!, this.hash)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant<Event<C>[]>([]))
      .into(EventsRune, this.chain)
  }
}
