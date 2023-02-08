import * as M from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { hex, HexHash } from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { EventsRune } from "./EventsRune.ts"

export class BlockRune<out U, out C extends Chain = Chain> extends Rune<known.SignedBlock, U> {
  constructor(
    _prime: BlockRune<U, C>["_prime"],
    readonly client: ClientRune<U, C>,
    readonly hash: Rune<HexHash, U>,
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
    const metadata = this.client.metadata()
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
    return this.client
      .metadata()
      .pallet("System")
      .storage("Events")
      .entry([], this.hash)
      .unsafeAs<C["event"][]>()
      .into(EventsRune, this)
  }
}
