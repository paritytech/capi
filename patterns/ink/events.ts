import { AccountIdRune, ApplyExtrinsicEventPhase, Rune, RunicArgs } from "../../mod.ts"

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

export function instantiationEventIntoPublicKey<X>(
  ...[event]: RunicArgs<X, [event: InstantiatedEvent]>
) {
  return Rune
    .resolve(event)
    .access("event", "value", "contract")
    .into(AccountIdRune)
}
