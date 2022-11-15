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

export type RpcMethods = {
  methods: string[]
}

export type SmoldotRpc = {
  // account_nextIndex - not implemented in smoldot
  // author_hasKey - not implemented in smoldot
  // author_hasSessionKeys - not implemented in smoldot
  // author_insertKey - not implemented in smoldot
  // author_pendingExtrinsics - in rpc/known/author
  // author_removeExtrinsic - not implemented in smoldot
  // author_rotateKeys - not implemented in smoldot
  // author_submitAndWatchExtrinsic - in rpc/known/author
  // author_submitExtrinsic - in rpc/known/author
  // author_unwatchExtrinsic - in rpc/known/author
  // babe_epochAuthorship - in rpc/known/babe
  // chain_getBlock - in rpc/known/chain
  // chain_getBlockHash - in rpc/known/chain
  // chain_getFinalizedHead - in rpc/known/chain
  // chain_getHeader - in rpc/known/chain
  // chain_subscribeAllHeads - in rpc/known/chain
  // chain_subscribeFinalizedHeads - in rpc/known/chain
  // chain_subscribeNewHeads - in rpc/known/chain
  // chain_unsubscribeAllHeads - in rpc/known/chain
  // chain_unsubscribeFinalizedHeads - in rpc/known/chain
  // chain_unsubscribeNewHeads - in rpc/known/chain
  // childstate_getKeys - not implemented in smoldot
  // childstate_getStorage - not implemented in smoldot
  // childstate_getStorageHash - not implemented in smoldot
  // childstate_getStorageSize - not implemented in smoldot
  // grandpa_roundState - not implemented in smoldot
  // offchain_localStorageGet - not implemented in smoldot
  // offchain_localStorageSet - not implemented in smoldot
  // payment_queryInfo - in rpc/known/payment
  rpc_methods(): RpcResult<RpcMethods>
  // state_call - in rpc/known/state
  // state_getKeys - in rpc/known/state
  // state_getKeysPaged - in rpc/known/state
  // state_getMetadata - in rpc/known/state
  // state_getPairs - in rpc/known/state - not implemented in smoldot
  // state_getReadProof - in rpc/known/state - not implemented in smoldot
  // state_getRuntimeVersion - in rpc/known/state
  // state_getStorage - in rpc/known/state
  // state_getStorageHash - in rpc/known/state - not implemented in smoldot
  // state_getStorageSize - in rpc/known/state - not implemented in smoldot
  // state_queryStorage - in rpc/known/state - not implemented in smoldot
  // state_queryStorageAt - in rpc/known/state
  // state_subscribeRuntimeVersion - in rpc/known/state
  // state_subscribeStorage - in rpc/known/state
  // state_unsubscribeRuntimeVersion - in rpc/known/state
  // state_unsubscribeStorage - in rpc/known/state
  // system_addReservedPeer - in rpc/known/system - not implemented in smoldot
  // system_chain - in rpc/known/system
  // system_chainType - in rpc/known/system
  // system_chainType - in rpc/known/system
  // system_dryRun - in rpc/known/system - not implemented in smoldot
  // system_health - in rpc/known/system
  // system_localListenAddresses - in rpc/known/system
  // system_localPeerId - in rpc/known/system
  // system_name - in rpc/known/system
  // system_networkState - in rpc/known/system - not implemented in smoldot
  // system_nodeRoles - in rpc/known/system
  // system_peers - in rpc/known/system
  // system_properties - in rpc/known/system
  // system_removeReservedPeer - in rpc/known/system - not implemented in smoldot
  // system_version - in rpc/known/system
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
  // not implemented in smoldot
  // network_unstable_subscribeEvents(): RpcResult<string>
  // network_unstable_unsubscribeEvents(subscription: string): RpcResult<void>
  chainHead_unstable_finalizedDatabase(maxSizeBytes?: bigint): RpcResult<string>
}

export type ErrorResponse =
  | ParseError
  | InvalidRequest
  | MethodNotFound
  | InvalidParams
  | InternalError
  | ServerError
  | MethodError

type ParseError = SerdeError<-32700>
type InvalidRequest = SerdeError<-32600>
type MethodNotFound = SerdeError<-32601>
type InvalidParams = SerdeError<-32602>
type InternalError = SerdeError<-32603>
type ServerError = SerdeError<number /*[-32099..=-32000]*/>
type MethodError = SerdeError<number /* [-32700..=-32000]*/>

type SerdeError<code = number> = {
  code: code
  message: string
  data?: unknown
}
