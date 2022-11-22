import { Hash, Hex, RpcResult, Subscription } from "./utils.ts"

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
  apis: Record<Hex, number>
}

export type ChainHeadUnstableFollowEvent = {
  event: "initialized"
  finalizedBlockHash: Hash
  finalizedBlockRuntime?: MaybeRuntimeSpec
} | {
  event: "newBlock"
  blockHash: Hash
  parentBlockHash: Hash
  newRuntime?: MaybeRuntimeSpec
} | {
  event: "bestBlockChanged"
  bestBlockHash: Hash
} | {
  event: "finalized"
  finalizedBlockHashes: Hash[]
  prunedBlockHashes: Hash[]
} | {
  event: "stop"
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
  hash: Hash
  index: string
}

export type SmoldotRpc = {
  chainHead_unstable_body(
    followSubscription: string,
    hash: Hash,
    networkConfig?: NetworkConfig,
  ): RpcResult<string>
  chainHead_unstable_call(
    followSubscription: string,
    hash: Hash,
    fn: string,
    callParameters: Hex,
    networkConfig?: NetworkConfig,
  ): RpcResult<string>
  chainHead_unstable_follow(
    runtimeUpdates: boolean,
  ): RpcResult<Subscription<"chainHead_unstable_follow", ChainHeadUnstableFollowEvent>>
  chainHead_unstable_genesisHash(): RpcResult<Hash>
  chainHead_unstable_header(followSubscription: string, hash: Hash): RpcResult<Hex>
  chainHead_unstable_stopBody(subscription: string): RpcResult<void>
  chainHead_unstable_stopCall(subscription: string): RpcResult<void>
  chainHead_unstable_stopStorage(subscription: string): RpcResult<void>
  chainHead_unstable_storage(
    followSubscription: string,
    hash: Hash,
    key: Hex,
    childKey?: Hex,
    networkConfig?: NetworkConfig,
  ): RpcResult<string>
  chainHead_unstable_unfollow(followSubscription: string): RpcResult<void>
  chainHead_unstable_unpin(followSubscription: string, hash: Hash): RpcResult<void>
  chainSpec_unstable_chainName(): RpcResult<string>
  chainSpec_unstable_genesisHash(): RpcResult<Hash>
  chainSpec_unstable_properties(): RpcResult<Record<string, unknown>>
  sudo_unstable_p2pDiscover(multiaddr: string): RpcResult<void>
  sudo_unstable_version(): RpcResult<string>
  transaction_unstable_submitAndWatch(
    transaction: Hex,
  ): RpcResult<Subscription<"transaction_unstable_submitAndWatch", TransactionWatchEvent>>
  transaction_unstable_unwatch(subscription: string): RpcResult<void>
  chainHead_unstable_finalizedDatabase(maxSizeBytes?: bigint): RpcResult<string>
}

// TODO: do we even care about narrowing error code?
export type ParseErrorCode = -32700
export type InvalidRequestCode = -32600
export type MethodNotFoundCode = -32601
export type InvalidParamsCode = -32602
export type InternalErrorCode = -32603
export type ServerErrorCode = number /*[-32099..=-32000]*/
export type MethodErrorCode = number /* [-32700..=-32000]*/
