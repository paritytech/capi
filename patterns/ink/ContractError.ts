import { EventRecord } from "../../fluent/EventsRune.ts"
import { ClientRune, ExtrinsicFailedEvent, RuntimeEvent } from "../../fluent/mod.ts"
import { Client } from "../../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"

// TODO: determine how best to attach `decodeRune` an event / handling polymorphic types with Rune
export function decodeError<X>(
  ...args: RunicArgs<
    X,
    [client: Client, failEvent: EventRecord<RuntimeEvent<"System", ExtrinsicFailedEvent>>]
  >
) {
  const [client, failEvent] = RunicArgs.resolve(args)
  const metadata = client.into(ClientRune).metadata()
  const $error = Rune
    .tuple([
      metadata.deriveCodec,
      metadata
        .pallet("Contracts")
        .into(ValueRune)
        .access("error")
        .unhandle(undefined)
        .handle(undefined, () => Rune.constant(new FailedToDecodeErrorError()))
        .unhandle(FailedToDecodeErrorError)
        .access("id"),
    ])
    .map(([deriveCodec, i]) => deriveCodec(i))
  return Rune
    .tuple([failEvent, $error]).map(([failEvent, $error]) => {
      const { dispatchError } = failEvent.event.value
      if (dispatchError.type !== "Module") return new FailedToDecodeErrorError()
      return $error.decode(dispatchError.value.error)
    })
    .unhandle(FailedToDecodeErrorError)
}

export class FailedToDecodeErrorError extends Error {
  override readonly name = "FailedToDecodeErrorError"
}
