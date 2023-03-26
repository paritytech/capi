import { Chain } from "./ChainRune.ts"
import { EventsRune } from "./EventsRune.ts"

export class ExtrinsicEventsRune<out C extends Chain, out U> extends EventsRune<C, U> {
  // TODO: update
  // // TODO: make generic over `Chain.Error` upon T6 metadata rework
  // unhandleFailed() {
  //   const dispatchError = this
  //     .into(ValueRune)
  //     .map((events): SystemExtrinsicFailedEvent | undefined =>
  //       events.find(isSystemExtrinsicFailedEvent)
  //     )
  //     .unhandle(undefined)
  //     .access("event", "value", "dispatchError")
  //     .map((dispatchError) => {
  //       if (dispatchError.type === "Module") return dispatchError.value
  //       return new ExtrinsicError(dispatchError)
  //     })
  //     .unhandle(ExtrinsicError)
  //   const metadata = this.chain.metadata()
  //   const pallet = Rune
  //     .tuple([
  //       metadata.into(ValueRune).access("pallets"),
  //       dispatchError.access("index"),
  //     ])
  //     .map(([pallets, i]) => pallets.find((pallet) => pallet.i === i)!)
  //   return Rune
  //     .tuple([metadata.deriveCodec, pallet])
  //     .map(([deriveCodec, pallet]) => deriveCodec(pallet.error!))
  //     .into(CodecRune)
  //     .decoded(dispatchError.access("error"))
  //     .map((data) => new ExtrinsicError((typeof data === "string" ? { type: data } : data) as any))
  //     .unhandle(ExtrinsicError)
  //     .rehandle(undefined, () => this /* TODO: type-level exclusions? */)
  // }
}

export class ExtrinsicError<D extends { type: string }> extends Error {
  override readonly name = "ExtrinsicError"

  constructor(data: D) {
    super(data.type)
  }
}
