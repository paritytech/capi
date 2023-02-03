import { Rune } from "../rune/mod.ts"
import { Chain, ClientRune } from "./client.ts"

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
  constructor(_prime: EventsRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }
}
