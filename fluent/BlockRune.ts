import { hex } from "../crypto/mod.ts"
import * as M from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { EventsRune } from "./EventsRune.ts"

export class BlockRune<out U, out C extends Chain = Chain> extends Rune<known.SignedBlock, U> {
  constructor(
    _prime: BlockRune<U, C>["_prime"],
    readonly chain: ChainRune<U, C>,
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
    const metadata = this.chain.metadata()
    const $extrinsic = Rune
      .rec({
        metadata,
        deriveCodec: metadata.deriveCodec,
        sign: null!,
        prefix: null!,
      })
      .map(M.$extrinsic)
      .into(CodecRune)
    return this
      .extrinsicsRaw()
      .into(ArrayRune)
      .mapArray((h) => $extrinsic.decoded(h.map(hex.decode)))
  }

  events() {
    return this.chain
      .metadata()
      .pallet("System")
      .storage("Events")
      .entry([], this.hash)
      .unsafeAs<Chain.Event<C>[] | undefined>()
      .into(ValueRune)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant<Chain.Event<C>[]>([]))
      .into(EventsRune, this.chain)
  }
}
