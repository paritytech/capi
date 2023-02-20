import { AuthorCalls, AuthorSubscriptions } from "./author.ts"
import { BabeCalls } from "./babe.ts"
import { BeefyCalls, BeefySubscriptions } from "./beefy.ts"
import { ChainCalls, ChainSubscriptions } from "./chain.ts"
import { ChildStateCalls } from "./childstate.ts"
import { ContractsCalls } from "./contracts.ts"
import { FrameSystemCalls } from "./framesystem.ts"
import { GrandpaCalls, GrandpaSubscriptions } from "./grandpa.ts"
import { MmrCalls } from "./mmr.ts"
import { OffchainCalls } from "./offchain.ts"
import { TransactionPaymentCalls } from "./payment.ts"
import { StateCalls, StateSubscriptions } from "./state.ts"
import { StateMigrationCalls } from "./statemigration.ts"
import { SyncCalls } from "./sync.ts"
import { SystemCalls } from "./system.ts"

export type Calls =
  & AuthorCalls
  & BabeCalls
  & BeefyCalls
  & ChainCalls
  & ChildStateCalls
  & ContractsCalls
  & FrameSystemCalls
  & GrandpaCalls
  & MmrCalls
  & OffchainCalls
  & StateCalls
  & StateMigrationCalls
  & SyncCalls
  & SystemCalls
  & TransactionPaymentCalls

export type Subscriptions =
  & AuthorSubscriptions
  & BeefySubscriptions
  & ChainSubscriptions
  & GrandpaSubscriptions
  & StateSubscriptions

export * from "./author.ts"
export * from "./babe.ts"
export * from "./beefy.ts"
export * from "./chain.ts"
export * from "./childstate.ts"
export * from "./contracts.ts"
export * from "./framesystem.ts"
export * from "./grandpa.ts"
export * from "./mmr.ts"
export * from "./offchain.ts"
export * from "./payment.ts"
export * as smoldot from "./smoldot.ts"
export * from "./state.ts"
export * from "./statemigration.ts"
export * from "./sync.ts"
export * from "./system.ts"
export * from "./utils.ts"
