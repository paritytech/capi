import { Subscription } from "./utils.ts"

export type NetworkConfig = {
  totalAttempts: number
  maxParallel: number
  timeoutMs: number
}

export type MaybeRuntimeSpec = {
  type: "valid"
  spec: RuntimeSpec
} | {
  type: "invalid"
  error: string
}
export type RuntimeSpec = {
  specName: string
  implName: string
  authoringVersion: number
  specVersion: number
  implVersion: number
  transactionVersion?: number
  apis: [string, number][]
}

export type ChainHeadUnstableFollowEvent =
  | ChainHeadUnstableFollowEvent.Initialized
  | ChainHeadUnstableFollowEvent.NewBlock
  | ChainHeadUnstableFollowEvent.BestBlockChanged
  | ChainHeadUnstableFollowEvent.Finalized
  | ChainHeadUnstableFollowEvent.Stop
export namespace ChainHeadUnstableFollowEvent {
  export type Initialized = {
    event: "initialized"
    finalizedHash: string
    finalizedBlockRuntime?: MaybeRuntimeSpec
  }
  export type NewBlock = {
    event: "newBlock"
    blockHash: string
    parentBlockHash: string
    newRuntime?: MaybeRuntimeSpec
  }
  export type BestBlockChanged = {
    event: "bestBlockChanged"
    bestBlockHash: string
  }
  export type Finalized = {
    event: "finalized"
    finalizedBlockHashes: string[]
    prunedBlockHashes: string[]
  }
  export type Stop = { event: "stop" }
}

export type TransactionWatchEvent = {
  event: "validated"
} | {
  event: "broadcasted"
  numPeers: number
} | {
  event: "bestChainBlockIncluded"
  block?: TransactionWatchEventBlock
} | {
  event: "finalized"
  block: TransactionWatchEventBlock
} | {
  event: "error"
  error: string
} | {
  event: "invalid"
  error: string
} | {
  event: "dropped"
  broadcasted: boolean
  error: string
}

export type TransactionWatchEventBlock = {
  hash: string
  index: string
}

export type ExperimentalCalls = {
  chainHead_unstable_body(
    followSubscription: string,
    hash: string,
    networkConfig?: NetworkConfig,
  ): string
  chainHead_unstable_call(
    followSubscription: string,
    hash: string,
    fn: string,
    callParameters: string,
    networkConfig?: NetworkConfig,
  ): string
  chainHead_unstable_genesisHash(): string
  chainHead_unstable_header(followSubscription: string, hash: string): string
  chainHead_unstable_stopBody(subscription: string): void
  chainHead_unstable_stopCall(subscription: string): void
  chainHead_unstable_stopStorage(subscription: string): void
  chainHead_unstable_storage(
    followSubscription: string,
    hash: string,
    key: string,
    childKey?: string,
    networkConfig?: NetworkConfig,
  ): string
  chainHead_unstable_unfollow(followSubscription: string): void
  chainHead_unstable_unpin(followSubscription: string, hash: string): void
  chainSpec_unstable_chainName(): string
  chainSpec_unstable_genesisHash(): string
  chainSpec_unstable_properties(): Record<string, unknown>
  sudo_unstable_p2pDiscover(multiaddr: string): void
  sudo_unstable_version(): string
  transaction_unstable_unwatch(subscription: string): void
  chainHead_unstable_finalizedDatabase(maxSizeBytes?: bigint): string
}

export type ExperimentalSubscriptions = {
  chainHead_unstable_follow(
    runtimeUpdates: boolean,
  ): Subscription<"chainHead_unstable_follow", ChainHeadUnstableFollowEvent>
  transaction_unstable_submitAndWatch(
    transaction: string,
  ): Subscription<"transaction_unstable_submitAndWatch", TransactionWatchEvent>
}

// TODO: do we even care about narrowing error code?
export type ParseErrorCode = -32700
export type InvalidRequestCode = -32600
export type MethodNotFoundCode = -32601
export type InvalidParamsCode = -32602
export type InternalErrorCode = -32603
export type ServerErrorCode = number /*[-32099..=-32000]*/
export type MethodErrorCode = number /* [-32700..=-32000]*/
