import { ChainError } from "../../mod.ts"

export interface ProxyEvent {
  type: "Proxy"
  value: ProxyRuntimeEvent
}
export type ProxyRuntimeEvent =
  | ProxyRuntimeEvent.ProxyExecuted
  | ProxyRuntimeEvent.PureCreated
  | ProxyRuntimeEvent.Announced
  | ProxyRuntimeEvent.ProxyAdded
  | ProxyRuntimeEvent.ProxyRemoved
export namespace ProxyRuntimeEvent {
  /** A proxy was executed correctly, with the given. */
  export interface ProxyExecuted {
    type: "ProxyExecuted"
    result: null | ChainError<DispatchError>
  }
  /**
   * A pure account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  export interface PureCreated {
    type: "PureCreated"
    pure: Uint8Array
    who: Uint8Array
    proxyType: ProxyType
    disambiguationIndex: number
  }
  /** An announcement was placed to make a call in the future. */
  export interface Announced {
    type: "Announced"
    real: Uint8Array
    proxy: Uint8Array
    callHash: Uint8Array
  }
  /** A proxy was added. */
  export interface ProxyAdded {
    type: "ProxyAdded"
    delegator: Uint8Array
    delegatee: Uint8Array
    proxyType: ProxyType
    delay: number
  }
  /** A proxy was removed. */
  export interface ProxyRemoved {
    type: "ProxyRemoved"
    delegator: Uint8Array
    delegatee: Uint8Array
    proxyType: ProxyType
    delay: number
  }
}

export type ProxyType =
  | "Any"
  | "NonTransfer"
  | "Governance"
  | "Staking"
  | "IdentityJudgement"
  | "CancelProxy"
  | "Auction"

export type DispatchError =
  | DispatchError.Other
  | DispatchError.CannotLookup
  | DispatchError.BadOrigin
  | DispatchError.Module
  | DispatchError.ConsumerRemaining
  | DispatchError.NoProviders
  | DispatchError.TooManyConsumers
  | DispatchError.Token
  | DispatchError.Arithmetic
  | DispatchError.Transactional
  | DispatchError.Exhausted
  | DispatchError.Corruption
  | DispatchError.Unavailable
export namespace DispatchError {
  export interface Other {
    type: "Other"
  }
  export interface CannotLookup {
    type: "CannotLookup"
  }
  export interface BadOrigin {
    type: "BadOrigin"
  }
  export interface Module {
    type: "Module"
    value: ModuleError
  }
  export interface ConsumerRemaining {
    type: "ConsumerRemaining"
  }
  export interface NoProviders {
    type: "NoProviders"
  }
  export interface TooManyConsumers {
    type: "TooManyConsumers"
  }
  export interface Token {
    type: "Token"
    value: TokenError
  }
  export interface Arithmetic {
    type: "Arithmetic"
    value: ArithmeticError
  }
  export interface Transactional {
    type: "Transactional"
    value: TransactionalError
  }
  export interface Exhausted {
    type: "Exhausted"
  }
  export interface Corruption {
    type: "Corruption"
  }
  export interface Unavailable {
    type: "Unavailable"
  }
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
