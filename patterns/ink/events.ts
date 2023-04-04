import { AccountIdRune, ApplyExtrinsicEventPhase, Rune, RunicArgs } from "../../mod.ts"

export interface ContractsRuntimeEvent {
  phase: ApplyExtrinsicEventPhase
  event: {
    type: "Contracts"
    value: {
      contract?: Uint8Array
    }
  }
}

export function isContractsRuntimeEvent(event: any): event is ContractsRuntimeEvent {
  return event.event.type === "Contracts"
}

export interface InstantiatedEvent {
  phase: ApplyExtrinsicEventPhase
  event: {
    type: "Contracts"
    value: {
      type: "Instantiated"
      deployer: Uint8Array
      contract: Uint8Array
    }
  }
}

export function isInstantiatedEvent(event: any): event is InstantiatedEvent {
  return event.event.type === "Contracts" && (event.event.value as any).type === "Instantiated"
}

export function instantiationEventIntoPublicKey<X>(
  ...[event]: RunicArgs<X, [event: InstantiatedEvent]>
) {
  return Rune
    .resolve(event)
    .access("event", "value", "contract")
    .into(AccountIdRune)
}
