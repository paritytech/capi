export interface Event<E extends RuntimeEvent = RuntimeEvent> {
  phase: EventPhase
  event: E
  topics: Uint8Array[]
}
export interface RuntimeEvent<
  P extends string = string,
  V extends RuntimeEventValue = RuntimeEventValue,
> {
  type: P
  value: V
}
export interface RuntimeEventValue {
  type: string
}

export type EventPhase =
  | EventPhase.ApplyExtrinsic
  | EventPhase.Finalization
  | EventPhase.Initialization
export namespace EventPhase {
  export interface ApplyExtrinsic {
    type: "ApplyExtrinsic"
    value: number
  }
  export interface Finalization {
    type: "Finalization"
  }
  export interface Initialization {
    type: "Initialization"
  }
}

// TODO: delete this
export type SystemExtrinsicFailedEvent = Event<{
  type: "System"
  value: {
    type: "ExtrinsicFailed"
    dispatchError: DispatchError
    dispatchInfo: unknown // TODO
  }
}>
export type DispatchError =
  | "Other"
  | "CannotLookup"
  | "BadOrigin"
  | "Module"
  | "ConsumerRemaining"
  | "NoProviders"
  | "TooManyConsumers"
  | "Token"
  | "Arithmetic"
  | "Transactional"
  | "Exhausted"
  | "Corruption"
  | "Unavailable"
  | {
    type: "Module"
    value: {
      index: number
      error: Uint8Array
    }
  }

export function isSystemExtrinsicFailedEvent(event: Event): event is SystemExtrinsicFailedEvent {
  if (event.event.type === "System") {
    const { value } = event.event
    return typeof value === "object" && value !== null && "type" in value
      && value.type === "ExtrinsicFailed"
  }
  return false
}
