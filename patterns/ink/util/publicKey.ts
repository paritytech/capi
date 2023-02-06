import {
  EventRecord,
  ExtrinsicFailedRuntimeEvent,
  isExtrinsicFailEvent,
  PublicKeyRune,
} from "../../../fluent/mod.ts"
import { Rune, RunicArgs } from "../../../rune/mod.ts"
import { FailedToFindContractAddressError, ResultEvent } from "./resultEvent.ts"

export function publicKeyFromResultEvent<X>(...[event]: RunicArgs<X, [ResultEvent]>) {
  return Rune
    .resolve(event)
    .map((event) => {
      if (isExtrinsicFailEvent(event)) return new FailedToInstantiateContractError(event)
      const { value } = event.event
      if ("contract" in value) return value.contract
      return new FailedToFindContractAddressError()
    })
    .unhandle(FailedToInstantiateContractError)
    .unhandle(FailedToFindContractAddressError)
    .into(PublicKeyRune)
}

export class FailedToInstantiateContractError extends Error {
  override readonly name = "FailedToInstantiateContractError"

  constructor(readonly event: EventRecord<ExtrinsicFailedRuntimeEvent>) {
    super()
  }
}
