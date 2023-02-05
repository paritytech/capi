import { EventRecord } from "../../fluent/EventsRune.ts"
import {
  Chain,
  ExtrinsicFailedEvent,
  ExtrinsicStatusRune,
  isExtrinsicFailEvent,
  PublicKeyRune,
  RuntimeEvent,
  SignedExtrinsicRune,
} from "../../fluent/mod.ts"
import { ValueRune } from "../../rune/mod.ts"
import { ContractInstanceRune } from "./ContractInstanceRune.ts"
import { Contract } from "./ContractMetadata.ts"
import { ContractRune } from "./ContractRune.ts"

export class ContractInstantiationExtrinsicStatusRune<out U1, out U2, out C extends Chain = Chain>
  extends ExtrinsicStatusRune<U1, U2, C>
{
  constructor(
    _prime: ExtrinsicStatusRune<U1, U2, C>["_prime"],
    extrinsic: SignedExtrinsicRune<U2, C>,
    readonly contract: ContractRune<U2>,
  ) {
    super(_prime, extrinsic)
  }

  override logStatus(...prefix: unknown[]) {
    return super
      .logStatus(...prefix)
      .into(ContractInstantiationExtrinsicStatusRune, this.extrinsic, this.contract)
  }

  resultEvent() {
    return this
      .events()
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

  publicKey() {
    return this.resultEvent()
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

  address() {
    return this.publicKey().address(this.extrinsic.client)
  }

  instance() {
    return this.publicKey().into(ContractInstanceRune, this.extrinsic.client, this.contract)
  }
}

export interface ContractInstantiatedEvent {
  type: "Instantiated"
  deployer: Uint8Array
  contract: Uint8Array
}
export function isInstantiationSuccessEvent(
  event_: EventRecord,
): event_ is EventRecord<RuntimeEvent<"Contracts", ContractInstantiatedEvent>> {
  const { event } = event_
  return event.type === "Contracts" && event.value.type === "Instantiated"
}

export class FailedToInstantiateContractError extends Error {
  override readonly name = "FailedToInstantiateContractError"

  constructor(readonly event: EventRecord<RuntimeEvent<"System", ExtrinsicFailedEvent>>) {
    super()
  }
}

export class FailedToFindContractAddressError extends Error {
  override readonly name = "FailedToFindContractAddressError"
}
