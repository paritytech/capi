import { Weight } from "./Weight.ts"

export interface Event {
  phase: EventPhase
  event: RuntimeEvent
  topics: Uint8Array[]
}

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

export interface RuntimeEvent {
  type: string
  value: unknown
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
