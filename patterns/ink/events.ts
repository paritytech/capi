import { PublicKeyRune } from "../../fluent/mod.ts"
import {
  ApplyExtrinsicEventPhase,
  Event,
  RuntimeEvent,
  RuntimeEventData,
} from "../../primitives/mod.ts"
import { Rune, RunicArgs } from "../../rune/mod.ts"
import { HexHash } from "../../util/branded.ts"

export type ContractEvent =
  | InstantiatedEvent
  | TerminatedEvent
  | CodeStoredEvent
  | ContractEmittedEvent
  | CodeRemovedEvent
  | ContractCodeUpdatedEvent
  | CalledEvent
  | DelegateCalledEvent

export const isInstantiatedEvent = isContractEvent<InstantiatedEvent>("Instantiated")
export type InstantiatedEvent = ContractEventBase<{
  type: "Instantiated"
  deployer: Uint8Array
  contract: Uint8Array
}>

export const isTerminatedEvent = isContractEvent<TerminatedEvent>("Terminated")
export type TerminatedEvent = ContractEventBase<{
  type: "Terminated"
  contract: Uint8Array
  beneficiary: Uint8Array
}>

export const isCodeStoredEvent = isContractEvent<CodeStoredEvent>("CodeStored")
export type CodeStoredEvent = ContractEventBase<{
  type: "CodeStored"
  code_hash: HexHash
}>

export const isContractEmittedEvent = isContractEvent<ContractEmittedEvent>("ContractEmitted")
export type ContractEmittedEvent = ContractEventBase<{
  type: "ContractEmitted"
  contract: Uint8Array
  data: Uint8Array
}>

export const isCodeRemovedEvent = isContractEvent<CodeRemovedEvent>("CodeRemoved")
export type CodeRemovedEvent = ContractEventBase<{
  type: "CodeRemoved"
  code_hash: Uint8Array
}>

export const isContractCodeUpdatedEvent = isContractEvent<ContractCodeUpdatedEvent>(
  "ContractCodeUpdated",
)
export type ContractCodeUpdatedEvent = ContractEventBase<{
  type: "ContractCodeUpdated"
  contract: Uint8Array
  new_code_hash: Uint8Array
  old_code_hash: Uint8Array
}>

export const isCalledEvent = isContractEvent<CalledEvent>("Called")
export type CalledEvent = ContractEventBase<{
  type: "Called"
  caller: Uint8Array
  contract: Uint8Array
}>

export const isDelegateCalledEvent = isContractEvent<DelegateCalledEvent>("DelegateCalled")
export type DelegateCalledEvent = ContractEventBase<{
  type: "DelegateCalled"
  contract: Uint8Array
  code_hash: Uint8Array
}>

type ContractEventBase<Data extends RuntimeEventData = RuntimeEventData> = Event<
  ApplyExtrinsicEventPhase,
  RuntimeEvent<"Contracts", Data>
>
function isContractEvent<E extends ContractEvent>(type: E["event"]["value"]["type"]) {
  return (e: Event): e is E => {
    const { event } = e
    return event.type === "Contracts" && event.value.type === type
  }
}

export function instantiationEvent<X>(...[events]: RunicArgs<X, [events: Event[]]>) {
  return Rune
    .resolve(events)
    .map((events) => events.find(isInstantiatedEvent))
    .unhandle(undefined)
    .rehandle(undefined, () => Rune.resolve(new FailedToFindContractInstantiatedError()))
    .unhandle(FailedToFindContractInstantiatedError)
}

export class FailedToFindContractInstantiatedError extends Error {
  override readonly name = "FailedToFindContractAddressError"
}

export function instantiationEventIntoPublicKey<X>(
  ...[event]: RunicArgs<X, [event: InstantiatedEvent]>
) {
  return Rune
    .resolve(event)
    .access("event", "value", "contract")
    .into(PublicKeyRune)
}
