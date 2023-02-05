import * as M from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { ArrayRune, Rune, RunicArgs } from "../rune/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { Hex, hex, HexHash } from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { Events, EventsRune } from "./EventsRune.ts"
import { chain } from "./rpc_method_runes.ts"

export class BlockRune<out U, out C extends Chain = Chain> extends Rune<known.SignedBlock, U> {
  constructor(
    _prime: BlockRune<U, C>["_prime"],
    readonly client: ClientRune<U, C>,
    readonly hash: Rune<HexHash, U>,
  ) {
    super(_prime)
  }

  header() {
    return chain.getHeader(this.client, this.hash)
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
      .unsafeAs<Events<C["runtimeEvent"]>>()
      .into(EventsRune, this.client)
  }

  eventI<X>(...[extrinsicHex]: RunicArgs<X, [Hex]>) {
    const extrinsics = this
      .into(ValueRune)
      .access("block", "extrinsics")
    return Rune
      .tuple([extrinsics, extrinsicHex])
      .map(([extrinsics, extrinsicHex]) => {
        const i = extrinsics.indexOf(("0x" + extrinsicHex) as Hex)
        return i === -1 ? undefined : i
      })
  }

  txEvents<X>(...[hex]: RunicArgs<X, [Hex]>) {
    return Rune
      .tuple([this.events(), this.eventI(hex)])
      .map(([events, i]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === i)
      )
  }
}
