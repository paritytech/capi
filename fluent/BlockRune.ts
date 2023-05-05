import { hex } from "../crypto/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { Chain } from "./ChainRune.ts"
import { EventsRune } from "./EventsRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class BlockRune<out C extends Chain, out U>
  extends PatternRune<known.SignedBlock, C, U, BlockHashRune<C, U>>
{
  hash = this.parent

  header() {
    return this.into(ValueRune).access("block", "header")
  }

  extrinsicsRaw() {
    return this.into(ValueRune).access("block", "extrinsics")
  }

  extrinsics() {
    return this
      .extrinsicsRaw()
      .into(ArrayRune)
      .mapArray((h) => this.chain.$extrinsic.decoded(h.map(hex.decode)))
  }

  events() {
    return this.chain
      .pallet("System")
      .storage("Events")
      .value(undefined!, this.parent)
      .unhandle(undefined)
      .rehandle(
        undefined,
        () => Rune.constant([]).unsafeAs<Chain.Storage.Value<C, "System", "Events">>(),
      )
      .into(EventsRune, this.chain)
  }
}
