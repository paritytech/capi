import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Hex } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ClientRune.ts"

export class EventsRune<out U, out C extends Chain = Chain> extends Rune<C["event"][], U> {
  constructor(
    _prime: EventsRune<U, C>["_prime"],
    readonly block: BlockRune<U, C>,
  ) {
    super(_prime)
  }

  indexOfTx<X>(...[extrinsicHex]: RunicArgs<X, [Hex]>) {
    const extrinsics = this
      .block
      .into(ValueRune)
      .access("block", "extrinsics")
    return Rune
      .tuple([extrinsics, extrinsicHex])
      .map(([extrinsics, extrinsicHex]) => {
        const i = extrinsics.indexOf(("0x" + extrinsicHex) as Hex)
        return i === -1 ? undefined : i
      })
  }

  filterTx<X>(...[hex]: RunicArgs<X, [Hex]>) {
    return Rune
      .tuple([this, this.indexOfTx(hex)])
      .map(([events, i]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === i)
      )
  }

  find<X, R extends C["event"]>(...[predicate]: RunicArgs<X, [(value: C["event"]) => value is R]>) {
    return Rune
      .tuple([this, predicate])
      .map(([events, guard]) => events.find(guard))
  }
}
