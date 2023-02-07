import {
  EventRecord,
  Events,
  ExtrinsicFailedRuntimeEvent,
  isExtrinsicFailEvent,
  RuntimeEvent,
} from "../../../fluent/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../../rune/mod.ts"

export function findResultEvent<X>(...[events]: RunicArgs<X, [Events]>) {
  return Rune
    .resolve(events)
    .into(ValueRune)
    .map((events) => {
      const failEvent = events.find(isExtrinsicFailEvent)
      if (failEvent) return failEvent
      const successEvent = events.find(isInstantiationSuccessEvent)
      if (!successEvent) return new FailedToFindContractAddressError()
      return successEvent
    })
    .unhandle(FailedToFindContractAddressError)
}

export type ResultEvent = EventRecord<
  ContractInstantiatedRuntimeEvent | ExtrinsicFailedRuntimeEvent
>

export type ContractInstantiatedRuntimeEvent = RuntimeEvent<"Contracts", {
  type: "Instantiated"
  deployer: Uint8Array
  contract: Uint8Array
}>

export function isInstantiationSuccessEvent(
  e: EventRecord,
): e is EventRecord<ContractInstantiatedRuntimeEvent> {
  const { event } = e
  return event.type === "Contracts" && event.value.type === "Instantiated"
}

export class FailedToFindContractAddressError extends Error {
  override readonly name = "FailedToFindContractAddressError"
}
