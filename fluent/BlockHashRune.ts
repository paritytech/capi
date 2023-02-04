import { Rune, ValueRune } from "../rune/mod.ts"
import { RunicArgs } from "../rune/RunicArgs.ts"
import { Hex, HexHash } from "../util/branded.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./client.ts"
import { Events, EventsRune } from "./EventsRune.ts"
import { HeaderRune } from "./HeaderRune.ts"
import { chain } from "./rpc_known_methods.ts"

export class BlockHashRune<out U, out C extends Chain = Chain>
  extends Rune<HexHash | undefined, U>
{
  constructor(_prime: BlockHashRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  block() {
    return chain
      .getBlock(this.client, this)
      .into(BlockRune, this.client)
  }

  header() {
    return chain
      .getHeader(this.client, this)
      .into(HeaderRune, this.client)
  }

  events() {
    return this.client
      .metadata()
      .pallet("System")
      .storage("Events")
      .entry([], this.into(ValueRune))
      .unsafeAs<Events<C["runtimeEvent"]>>()
      .into(EventsRune, this.client)
  }

  eventI<X>(...[extrinsicHex]: RunicArgs<X, [Hex]>) {
    const extrinsics = this
      .block()
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
      .tuple([this.events(), this.eventI(hex).unhandle(undefined)])
      .map(([events, i]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === i)
      )
  }
}
