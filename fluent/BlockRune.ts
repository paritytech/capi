import { hex } from "../crypto/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, is, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { Chain } from "./ChainRune.ts"
import { EventsRune } from "./EventsRune.ts"
import { PatternRune } from "./PatternRune.ts"

/** A rune representing a block */
export class BlockRune<out C extends Chain, out U>
  extends PatternRune<known.SignedBlock, C, U, BlockHashRune<C, U>>
{
  /** A rune representing the hash of the current block */
  hash = this.parent

  /** Get a rune representing the header of the current block */
  header() {
    return this.into(ValueRune).access("block", "header")
  }

  /** Get a rune representing the list of scale-encoded extrinsics of the current block */
  extrinsicsRaw() {
    return this.into(ValueRune).access("block", "extrinsics")
  }

  /** Get a rune representing the list of the extrinsics of the current block */
  extrinsics() {
    return this
      .extrinsicsRaw()
      .into(ArrayRune)
      .mapArray((h) => this.chain.$extrinsic.decoded(h.map(hex.decode)))
  }

  /** Get a rune representing the list of events of the current block */
  events() {
    return this.chain
      .pallet("System")
      .storage("Events")
      .value(undefined!, this.parent)
      .handle(
        is(undefined),
        () => Rune.constant([]).unsafeAs<Chain.Storage.Value<C, "System", "Events">>(),
      )
      .into(EventsRune, this.chain)
  }
}
