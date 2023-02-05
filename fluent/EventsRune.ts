import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Hex } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export type Events<RuntimeEvent extends RuntimeEventBase = RuntimeEventBase> = EventRecord<
  RuntimeEvent
>[]
export interface RuntimeEventBase {
  type: string
  value: {
    type: string
  }
}
export interface EventRecord<RuntimeEvent extends RuntimeEventBase> {
  phase: EventPhase
  event: RuntimeEvent
  topics: Uint8Array[]
}
export type EventPhase =
  | EventPhase.ApplyExtrinsic
  | EventPhase.Finalization
  | EventPhase.Initialization
export namespace EventPhase {
  export interface ApplyExtrinsic {
    type: "ApplyExtrinsic"
    value: number
  }
  export interface Finalization {
    type: "Finalization"
  }
  export interface Initialization {
    type: "Initialization"
  }
}

export class EventsRune<out U, out C extends Chain = Chain>
  extends Rune<Events<C["runtimeEvent"]>, U>
{
  constructor(
    _prime: EventsRune<U, C>["_prime"],
    readonly client: ClientRune<U, C>,
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
}
