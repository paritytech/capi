import { isSystemExtrinsicFailedEvent, SystemExtrinsicFailedEvent } from "../primitives/mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { EventsRune } from "./EventsRune.ts"

export class ExtrinsicEventsRune<
  out U,
  out C extends Chain = Chain,
  out E extends Chain.Event<C> = Chain.Event<C>,
> extends EventsRune<U, C, E> {
  // TODO: make generic over `Chain.Error` upon T6 metadata rework
  unhandleFailed() {
    const dispatchError = this
      .into(ValueRune)
      .map((events): SystemExtrinsicFailedEvent | undefined =>
        events.find(isSystemExtrinsicFailedEvent)
      )
      .unhandle(undefined)
      .access("event", "value", "dispatchError")
      .map((dispatchError) => {
        if (dispatchError.type === "Module") return dispatchError.value
        return new ExtrinsicError(dispatchError)
      })
      .unhandle(ExtrinsicError)
    const metadata = this.chain.metadata()
    const pallet = Rune
      .tuple([
        metadata.into(ValueRune).access("pallets"),
        dispatchError.access("index"),
      ])
      .map(([pallets, i]) => pallets.find((pallet) => pallet.i === i)!)
    const $error = Rune
      .tuple([metadata.deriveCodec, pallet])
      .map(([deriveCodec, pallet]) => deriveCodec(pallet.error!))
    return Rune
      .tuple([$error, dispatchError.access("error")])
      .map(([$error, data]) => new ExtrinsicError($error.decode(data)))
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
