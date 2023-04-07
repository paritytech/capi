import { AccountIdRune, ApplyExtrinsicEventPhase, Event, Rune, RunicArgs } from "../../mod.ts"

export interface ContractsRuntimeEvent<V = { contract?: Uint8Array }> extends
  Event<
    {
      type: "Contracts"
      value: V
    }
  >
{
  phase: ApplyExtrinsicEventPhase
}

export function isContractsRuntimeEvent(event: any): event is ContractsRuntimeEvent {
  return event.event.type === "Contracts"
}

export interface ContractEmittedEvent
  extends ContractsRuntimeEvent<{ type: "ContractEmitted"; contract: Uint8Array; data: Uint8Array }>
{}

export function isContractEmitted(event: any): event is ContractEmittedEvent {
  return isContractsRuntimeEvent(event) && (event.event.value as any).type === "ContractEmitted"
}

export interface InstantiatedEvent extends
  ContractsRuntimeEvent<{
    type: "Instantiated"
    deployer: Uint8Array
    contract: Uint8Array
  }>
{}

export function isInstantiatedEvent(event: any): event is InstantiatedEvent {
  return isContractsRuntimeEvent(event) && (event.event.value as any).type === "Instantiated"
}

export function instantiationEventIntoPublicKey<X>(
  ...[event]: RunicArgs<X, [event: InstantiatedEvent]>
) {
  return Rune
    .resolve(event)
    .access("event", "value", "contract")
    .into(AccountIdRune)
}
