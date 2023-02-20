import { Hash, Hex, ListOrValue, NumberOrHex, Subscription } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/0ba251c/primitives/runtime/src/generic/digest.rs
/** Generic header digest. */
export interface Digest {
  /** A list of logs in the digest. */
  logs: Hex[]
}

// https://github.com/paritytech/substrate/blob/01a3ad65/primitives/runtime/src/generic/header.rs#L39
/** Abstraction over a block header for a substrate chain. */
export interface Header {
  /** The parent hash. */
  parentHash: Hash
  /** The block number. */
  number: Hex
  /** The state trie merkle root */
  stateRoot: Hash
  /** The merkle root of the extrinsics. */
  extrinsicsRoot: Hash
  /** A chain-specific digest of data useful for light clients or referencing auxiliary data. */
  digest: Digest
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/runtime/src/generic/block.rs#L126
/** Abstraction over a substrate block and justification. */
export interface SignedBlock {
  /** Full block. */
  block: Block
  /** Block justification. */
  justifications?: [number[], number[]][]
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/runtime/src/generic/block.rs#L88
export interface Block {
  /** The block header. */
  header: Header
  /** The accompanying extrinsics. */
  extrinsics: Hex[]
}

// https://github.com/paritytech/substrate/blob/934fbfd/client/rpc-api/src/chain/mod.rs#L27
export type ChainCalls = {
  /** Get header. */
  chain_getHeader(hash?: Hash): Header | null
  /** Get header and body of a relay chain block. */
  chain_getBlock(hash?: Hash): SignedBlock | null
  /**
   * Get hash of the n-th block in the canon chain.
   *
   * By default returns latest block hash.
   */
  chain_getBlockHash(height?: ListOrValue<NumberOrHex>): ListOrValue<Hash | null>
  chain_getHead: ChainCalls["chain_getBlockHash"]
  /** Get hash of the last finalized block in the canon chain. */
  chain_getFinalizedHead(): Hash
  chain_getFinalisedHead: ChainCalls["chain_getFinalizedHead"]
}

export type ChainSubscriptions = {
  /** All head subscription. */
  chain_subscribeAllHeads(): Subscription<"chain_unsubscribeAllHeads", Header>
  /** New head subscription. */
  chain_subscribeNewHeads(): Subscription<"chain_unsubscribeNewHeads", Header>
  /** Finalized head subscription. */
  chain_subscribeFinalizedHeads(): Subscription<"chain_unsubscribeAllHeads", Header>
  chain_subscribeFinalisedHeads: ChainSubscriptions["chain_subscribeFinalizedHeads"]
}
