import { hex } from "../crypto/mod.ts"
import { $extrinsic } from "../frame_metadata/Extrinsic.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { Event, EventsRune } from "./EventsRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class BlockRune<out C extends Chain, out U>
  extends PatternRune<known.SignedBlock, C, U, Rune<string, U>>
{
  hash = this.parent

  header() {
    return this.into(ValueRune).access("block", "header")
  }

  extrinsicsRaw() {
    return this.into(ValueRune).access("block", "extrinsics")
  }

  extrinsics() {
    const $ext = Rune.fn($extrinsic)
      .call(this.chain.metadata)
      .into(CodecRune)
    return this
      .extrinsicsRaw()
      .into(ArrayRune)
      .mapArray((h) => $ext.decoded(h.map(hex.decode)))
  }

  events() {
    return this.chain
      .pallet("System")
      .storage("Events")
      .value(undefined!, this.parent)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant<Event<C>[]>([]))
      .into(EventsRune, this.chain)
  }
}
