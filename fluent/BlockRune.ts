import * as M from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { hex } from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { chain } from "./rpc_method_runes.ts"

export class BlockRune<out U, out C extends Chain = Chain> extends Rune<known.SignedBlock, U> {
  constructor(_prime: BlockRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  number() {
    return this.into(ValueRune).access("block", "header", "number")
  }

  hash() {
    return chain.getBlockHash(this.client, this.number())
  }

  extrinsicsRaw() {
    return this
      .into(ValueRune)
      .access("block", "extrinsics")
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
}
