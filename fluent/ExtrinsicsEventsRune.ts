import { is, Rune, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { Event, EventsRune } from "./EventsRune.ts"

export class ExtrinsicEventsRune<out C extends Chain, out U> extends EventsRune<C, U> {
  // TODO: handleFailed

  /** Get a rune representing the same list, but with any `System.ExtrinsicFailed` events moved to the U track */
  unhandleFailed() {
    const dispatchError = this
      .into(ValueRune)
      .map((events: any) =>
        events.find(isSystemExtrinsicFailedEvent) as SystemExtrinsicFailedEvent | undefined
      )
      .unhandle(is(undefined))
      .access("event", "value", "dispatchError")
      .map((dispatchError) => {
        // TODO: fix
        if ((dispatchError as any).type === "Module") return (dispatchError as any).value
        return new ExtrinsicError(dispatchError as any)
      })
      .unhandle(is(ExtrinsicError))
    return Rune
      .tuple([
        this.chain.metadata.into(ValueRune).access("pallets"),
        dispatchError.access("index"),
      ])
      .map(([pallets, id]) => Object.values(pallets).find((pallet) => pallet.id === id)!)
      .access("types", "error")
      .unhandle(is(undefined))
      .into(CodecRune)
      .decoded(dispatchError.access("error"))
      .map((data) => new ExtrinsicError((typeof data === "string" ? { type: data } : data) as any))
      .unhandle(is(ExtrinsicError))
      .rehandle(is(undefined), () => this /* TODO: type-level exclusions? */)
  }
}

/** An error that wraps the chain's system error event data */
export class ExtrinsicError<D extends { type: string }> extends Error {
  override readonly name = "ExtrinsicError"

  constructor(data: D) {
    super(data.type)
  }
}

// TODO: delete this
export type SystemExtrinsicFailedEvent = Event<{
  type: "System"
  value: {
    type: "ExtrinsicFailed"
    dispatchError: DispatchError
    dispatchInfo: any // TODO
  }
}>
export type DispatchError =
  | "Other"
  | "CannotLookup"
  | "BadOrigin"
  | "Module"
  | "ConsumerRemaining"
  | "NoProviders"
  | "TooManyConsumers"
  | "Token"
  | "Arithmetic"
  | "Transactional"
  | "Exhausted"
  | "Corruption"
  | "Unavailable"
  | { type: "Module"; value: number }

export function isSystemExtrinsicFailedEvent(event: Event): event is SystemExtrinsicFailedEvent {
  if (event.event.type === "System") {
    const { value } = event.event
    return typeof value === "object" && value !== null && "type" in value
      && value.type === "ExtrinsicFailed"
  }
  return false
}
