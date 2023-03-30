import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import {
  EventsRune,
  isSystemExtrinsicFailedEvent,
  SystemExtrinsicFailedEvent,
} from "./EventsRune.ts"

export class ExtrinsicEventsRune<out C extends Chain, out U> extends EventsRune<C, U> {
  // TODO:
  // handleFailed

  unhandleFailed() {
    const dispatchError = this
      .into(ValueRune)
      .map((events) =>
        events.find(isSystemExtrinsicFailedEvent) as SystemExtrinsicFailedEvent | undefined
      )
      .unhandle(undefined)
      .access("event", "value", "dispatchError")
      .map((dispatchError) => {
        // TODO: fix
        if ((dispatchError as any).type === "Module") return (dispatchError as any).value
        return new ExtrinsicError(dispatchError as any)
      })
      .unhandle(ExtrinsicError)
    return Rune
      .tuple([
        this.chain.metadata.into(ValueRune).access("pallets"),
        dispatchError.access("index"),
      ])
      .map(([pallets, id]) => Object.values(pallets).find((pallet) => pallet.id === id)!)
      .access("types", "error")
      .unhandle(undefined)
      .into(CodecRune)
      .decoded(dispatchError.access("error"))
      .map((data) => new ExtrinsicError((typeof data === "string" ? { type: data } : data) as any))
      .unhandle(ExtrinsicError)
      .rehandle(undefined, () => this /* TODO: type-level exclusions? */)
  }
}

export class ExtrinsicError<D extends { type: string }> extends Error {
  override readonly name = "ExtrinsicError"

  constructor(data: D) {
    super(data.type)
  }
}
