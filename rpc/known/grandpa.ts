import { Hex, Subscription } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/0ba251c/client/finality-grandpa/rpc/src/report.rs#L116
/**
 * The state of the current best round, as well as the background rounds in a
 * form suitable for serialization.
 */
export interface ReportedRoundStates {
  setId: number
  best: RoundState
  background: RoundState[]
}

// https://github.com/paritytech/substrate/blob/0ba251c/client/finality-grandpa/rpc/src/report.rs#L76
export interface RoundState {
  round: number
  totalWeight: number
  thresholdWeight: number
  prevotes: Prevotes
  precommits: Precommits
}

// https://github.com/paritytech/substrate/blob/0ba251c/client/finality-grandpa/rpc/src/report.rs#L62
export interface Prevotes {
  currentWeight: number
  missing: Hex[]
}

// https://github.com/paritytech/substrate/blob/0ba251c/client/finality-grandpa/rpc/src/report.rs#L69
export interface Precommits {
  currentWeight: number
  missing: Hex[]
}

// https://github.com/paritytech/substrate/blob/ded44948/client/finality-grandpa/rpc/src/notification.rs
/** An encoded justification proving that the given header has been finalized */
export type JustificationNotification = Hex

// https://github.com/paritytech/substrate/blob/ded44948/client/finality-grandpa/rpc/src/finality.rs
export type EncodedFinalityProof = Hex

// https://github.com/paritytech/substrate/blob/9b01569/client/finality-grandpa/rpc/src/lib.rs#L48
export type GrandpaCalls = {
  /**
   * Returns the state of the current best round state as well as the
   * ongoing background rounds.
   */
  grandpa_roundState(): ReportedRoundStates
  /**
   * Prove finality for the given block number by returning the Justification for the last block
   * in the set and all the intermediary headers to link them together.
   */
  grandpa_proveFinality(block: number): EncodedFinalityProof | null
}

export type GrandpaSubscriptions = {
  /**
   * Returns the block most recently finalized by Grandpa, alongside
   * side its justification.
   */
  grandpa_subscribeJustifications(): Subscription<
    "grandpa_unsubscribeJustifications",
    JustificationNotification
  >
}
