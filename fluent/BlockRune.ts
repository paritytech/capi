import * as M from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { hex } from "../util/mod.ts"
import { Chain, ClientRune } from "./client.ts"
import { CodecRune } from "./codec.ts"
import { Events, EventsRune } from "./EventsRune.ts"
import { chain } from "./rpc_known_methods.ts"

export class BlockRune<out U, out C extends Chain = Chain> extends Rune<known.SignedBlock, U> {
  number
  hash
  metadata

  constructor(_prime: BlockRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
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
      .into(EventsRune, this.client)
  }

  extrinsicsRaw() {
    return this
      .into(ValueRune)
      .access("block", "extrinsics")
  }

  extrinsics() {
    const metadata = this.client.metadata()
    // const $extrinsic = Rune
    //   .rec({
    //     metadata,
    //     deriveCodec: metadata.deriveCodec,
    //     sign: null!,
    //     prefix: null!,
    //   })
    //   .map(M.$extrinsic)
    //   .into(CodecRune)
    return this
      .extrinsicsRaw()
      .into(ArrayRune)
    // .mapArray((h) =>
    //   $extrinsic.decoded(h.map(hex.decode).dbg("hex decode:")).dbg("extrinsic decode:")
    // )
  }
}
