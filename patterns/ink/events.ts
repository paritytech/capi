import { PublicKeyRune } from "../../fluent/mod.ts"
import { ApplyExtrinsicEvent, applyExtrinsicGuard, RuntimeEventData } from "../../primitives/mod.ts"
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

export const isInstantiatedEvent = applyExtrinsicGuard<InstantiatedEvent>(
  "Contracts",
  "Instantiated",
)
export type InstantiatedEvent = ContractEventBase<{
  type: "Instantiated"
  deployer: Uint8Array
  contract: Uint8Array
}>

export const isTerminatedEvent = applyExtrinsicGuard<TerminatedEvent>("Contracts", "Terminated")
export type TerminatedEvent = ContractEventBase<{
  type: "Terminated"
  contract: Uint8Array
  beneficiary: Uint8Array
}>

export const isCodeStoredEvent = applyExtrinsicGuard<CodeStoredEvent>("Contracts", "CodeStored")
export type CodeStoredEvent = ContractEventBase<{
  type: "CodeStored"
  code_hash: HexHash
}>

export const isContractEmittedEvent = applyExtrinsicGuard<ContractEmittedEvent>(
  "Contracts",
  "ContractEmitted",
)
export type ContractEmittedEvent = ContractEventBase<{
  type: "ContractEmitted"
  contract: Uint8Array
  data: Uint8Array
}>

export const isCodeRemovedEvent = applyExtrinsicGuard<CodeRemovedEvent>("Contracts", "CodeRemoved")
export type CodeRemovedEvent = ContractEventBase<{
  type: "CodeRemoved"
  code_hash: Uint8Array
}>

export const isContractCodeUpdatedEvent = applyExtrinsicGuard<ContractCodeUpdatedEvent>(
  "Contracts",
  "ContractCodeUpdated",
)
export type ContractCodeUpdatedEvent = ContractEventBase<{
  type: "ContractCodeUpdated"
  contract: Uint8Array
  new_code_hash: Uint8Array
  old_code_hash: Uint8Array
}>

export const isCalledEvent = applyExtrinsicGuard<CalledEvent>("Contracts", "Called")
export type CalledEvent = ContractEventBase<{
  type: "Called"
  caller: Uint8Array
  contract: Uint8Array
}>

export const isDelegateCalledEvent = applyExtrinsicGuard<DelegateCalledEvent>(
  "Contracts",
  "DelegateCalled",
)
export type DelegateCalledEvent = ContractEventBase<{
  type: "DelegateCalled"
  contract: Uint8Array
  code_hash: Uint8Array
}>

type ContractEventBase<Data extends RuntimeEventData = RuntimeEventData> = ApplyExtrinsicEvent<
  "Contracts",
  Data
>

export function instantiationEventIntoPublicKey<X>(
  ...[event]: RunicArgs<X, [event: InstantiatedEvent]>
) {
  return Rune
    .resolve(event)
    .access("event", "value", "contract")
    .into(PublicKeyRune)
}
