import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Hex } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain, ClientRune } from "./ClientRune.ts"

export class EventsRune<out U, out C extends Chain = Chain> extends Rune<Events<C["event"]>, U> {
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

// TODO: clean up this file
// The following types are loosely modeled after those of sp-core

export type Events<E extends RuntimeEvent = RuntimeEvent> = EventRecord<E>[]

export interface EventRecord<E extends RuntimeEvent = RuntimeEvent> {
  phase: EventPhase
  event: E
  topics: Uint8Array[]
}

export interface RuntimeEvent<
  Pallet extends string = string,
  Value extends RuntimeEventData = RuntimeEventData,
> {
  type: Pallet
  value: Value
}

export interface RuntimeEventData<Type extends string = string> {
  type: Type
}

export type EventPhase =
  | ApplyExtrinsicEventPhase
  | FinalizationEventPhase
  | InitializationEventPhase
export interface ApplyExtrinsicEventPhase {
  type: "ApplyExtrinsic"
  value: number
}
export interface FinalizationEventPhase {
  type: "Finalization"
}
export interface InitializationEventPhase {
  type: "Initialization"
}

// TODO: generate the below?
export function isExtrinsicFailEvent(
  e: EventRecord,
): e is EventRecord<ExtrinsicFailedRuntimeEvent> {
  const { event } = e
  return event.type === "System" && event.value.type === "ExtrinsicFailed"
}

export type ExtrinsicFailedRuntimeEvent = RuntimeEvent<"System", {
  type: "ExtrinsicFailed"
  dispatchError: DispatchError
  dispatchInfo: DispatchInfo
}>

export type DispatchError =
  | DispatchError.Other
  | DispatchError.CannotLookup
  | DispatchError.BadOrigin
  | DispatchError.Module
  | DispatchError.ConsumerRemaining
  | DispatchError.NoProviders
  | DispatchError.TooManyConsumers
  | DispatchError.Token
  | DispatchError.Arithmetic
  | DispatchError.Transactional
  | DispatchError.Exhausted
  | DispatchError.Corruption
  | DispatchError.Unavailable
export namespace DispatchError {
  export interface Other {
    type: "Other"
  }
  export interface CannotLookup {
    type: "CannotLookup"
  }
  export interface BadOrigin {
    type: "BadOrigin"
  }
  export interface Module {
    type: "Module"
    value: ModuleError
  }
  export interface ConsumerRemaining {
    type: "ConsumerRemaining"
  }
  export interface NoProviders {
    type: "NoProviders"
  }
  export interface TooManyConsumers {
    type: "TooManyConsumers"
  }
  export interface Token {
    type: "Token"
    value: TokenError
  }
  export interface Arithmetic {
    type: "Arithmetic"
    value: ArithmeticError
  }
  export interface Transactional {
    type: "Transactional"
    value: TransactionalError
  }
  export interface Exhausted {
    type: "Exhausted"
  }
  export interface Corruption {
    type: "Corruption"
  }
  export interface Unavailable {
    type: "Unavailable"
  }
}

export interface ModuleError {
  index: number
  error: Uint8Array
}

export type TokenError =
  | "NoFunds"
  | "WouldDie"
  | "BelowMinimum"
  | "CannotCreate"
  | "UnknownAsset"
  | "Frozen"
  | "Unsupported"

export type ArithmeticError = "Underflow" | "Overflow" | "DivisionByZero"

export type TransactionalError = "LimitReached" | "NoLayer"

export interface DispatchInfo {
  weight: Weight
  class: DispatchClass
  paysFee: Pays
}

export interface Weight {
  refTime: bigint
  proofSize: bigint
}

export type DispatchClass = "Normal" | "Operational" | "Mandatory"
export type Pays = "Yes" | "No"
