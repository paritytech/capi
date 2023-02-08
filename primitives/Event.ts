import { Weight } from "./Weight.ts"

export interface Event<P extends EventPhase = EventPhase, E extends RuntimeEvent = RuntimeEvent> {
  phase: P
  event: E
  topics: Uint8Array[]
}
export function applyExtrinsicGuard<E extends Event>(
  pallet: E["event"]["type"],
  label: E["event"]["value"]["type"],
) {
  return (event: Event): event is E =>
    event.event.type === pallet && event.event.value.type === label
}

export type ApplyExtrinsicEvent<
  Pallet extends string = string,
  Value extends RuntimeEventData = RuntimeEventData,
> = Event<ApplyExtrinsicEventPhase, RuntimeEvent<Pallet, Value>>

export type EventPhase =
  | ApplyExtrinsicEventPhase
  | FinalizationEventPhase
  | InitializationEventPhase
export interface ApplyExtrinsicEventPhase {
  type: "ApplyExtrinsic"
  value: number
}
export interface FinalizationEventPhase {
  type: "Finalization"
}
export interface InitializationEventPhase {
  type: "Initialization"
}

export interface RuntimeEvent<
  Pallet extends string = string,
  Value extends RuntimeEventData = RuntimeEventData,
> {
  type: Pallet
  value: Value
}

export interface RuntimeEventData<Type extends string = string> {
  type: Type
}

export type ExtrinsicSuccessEvent = Event<
  ApplyExtrinsicEventPhase,
  RuntimeEvent<"System", {
    type: "ExtrinsicSuccess"
    dispatchInfo: DispatchInfo
  }>
>
export function isExtrinsicSuccessEvent(e: Event): e is ExtrinsicSuccessEvent {
  const { event } = e
  return event.type === "System" && event.value.type === "ExtrinsicSuccess"
}

export type ExtrinsicFailEvent = Event<
  ApplyExtrinsicEventPhase,
  RuntimeEvent<"System", {
    type: "ExtrinsicFailed"
    dispatchInfo: DispatchInfo
    dispatchError: DispatchError
  }>
>
export function isExtrinsicFailEvent(
  e: Event,
): e is ExtrinsicFailEvent {
  const { event } = e
  return event.type === "System" && event.value.type === "ExtrinsicFailed"
}

export interface DispatchInfo {
  weight: Weight
  class: DispatchClass
  paysFee: Pays
}

export type DispatchError =
  | OtherDispatchError
  | CannotLookupDispatchError
  | BadOriginDispatchError
  | ModuleDispatchError
  | ConsumerRemainingDispatchError
  | NoProvidersDispatchError
  | TooManyConsumersDispatchError
  | TokenDispatchError
  | ArithmeticDispatchError
  | TransactionalDispatchError
  | ExhaustedDispatchError
  | CorruptionDispatchError
  | UnavailableDispatchError
export interface OtherDispatchError {
  type: "Other"
}
export interface CannotLookupDispatchError {
  type: "CannotLookup"
}
export interface BadOriginDispatchError {
  type: "BadOrigin"
}
export interface ModuleDispatchError {
  type: "Module"
  value: ModuleError
}
export interface ConsumerRemainingDispatchError {
  type: "ConsumerRemaining"
}
export interface NoProvidersDispatchError {
  type: "NoProviders"
}
export interface TooManyConsumersDispatchError {
  type: "TooManyConsumers"
}
export interface TokenDispatchError {
  type: "Token"
  value: TokenError
}
export interface ArithmeticDispatchError {
  type: "Arithmetic"
  value: ArithmeticError
}
export interface TransactionalDispatchError {
  type: "Transactional"
  value: TransactionalError
}
export interface ExhaustedDispatchError {
  type: "Exhausted"
}
export interface CorruptionDispatchError {
  type: "Corruption"
}
export interface UnavailableDispatchError {
  type: "Unavailable"
}

export interface ModuleError {
  index: number
  error: Uint8Array
}

export type TokenError =
  | "NoFunds"
  | "WouldDie"
  | "BelowMinimum"
  | "CannotCreate"
  | "UnknownAsset"
  | "Frozen"
  | "Unsupported"

export type ArithmeticError = "Underflow" | "Overflow" | "DivisionByZero"

export type TransactionalError = "LimitReached" | "NoLayer"

export type DispatchClass = "Normal" | "Operational" | "Mandatory"

export type Pays = "Yes" | "No"
