import { HexEncoded } from "../../util/branded.ts"
import { Hash, Hex, ListOrValue, NumberOrHex, RpcResult, Subscription } from "./utils.ts"

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
  number: HexEncoded<bigint>
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
export type ChainRpc = {
  /** Get header. */
  chain_getHeader(hash?: Hash): RpcResult<Header | null>
  /** Get header and body of a relay chain block. */
  chain_getBlock(hash?: Hash): RpcResult<SignedBlock | null>
  /**
   * Get hash of the n-th block in the canon chain.
   *
   * By default returns latest block hash.
   */
  chain_getBlockHash(height?: ListOrValue<NumberOrHex>): RpcResult<ListOrValue<Hash | null>>
  chain_getHead: ChainRpc["chain_getBlockHash"]
  /** Get hash of the last finalized block in the canon chain. */
  chain_getFinalizedHead(): RpcResult<Hash>
  chain_getFinalisedHead: ChainRpc["chain_getFinalizedHead"]
  /** All head subscription. */
  chain_subscribeAllHeads(): RpcResult<Subscription<"chain_subscribeAllHeads", Header>>
  chain_unsubscribeAllHeads(
    subscription: Subscription<"chain_subscribeAllHeads", Header>,
  ): RpcResult<void>
  /** New head subscription. */
  chain_subscribeNewHeads(): RpcResult<Subscription<"chain_subscribeAllHeads", Header>>
  chain_unsubscribeNewHeads(
    subscription: Subscription<"chain_subscribeAllHeads", Header>,
  ): RpcResult<void>
  /** Finalized head subscription. */
  chain_subscribeFinalizedHeads(): RpcResult<Subscription<"chain_subscribeAllHeads", Header>>
  chain_unsubscribeFinalizedHeads(
    subscription: Subscription<"chain_subscribeAllHeads", Header>,
  ): RpcResult<void>
  chain_subscribeFinalisedHeads: ChainRpc["chain_subscribeFinalizedHeads"]
  chain_unsubscribeFinalisedHeads: ChainRpc["chain_unsubscribeFinalizedHeads"]
}
