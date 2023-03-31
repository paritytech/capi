import * as $ from "../../deps/scale.ts"
import { ListOrValue, NumberOrHex, Subscription } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/0ba251c/primitives/runtime/src/generic/digest.rs
/** Generic header digest. */
export interface Digest {
  /** A list of logs in the digest. */
  logs: string[]
}
export const $digest: $.Codec<Digest> = $.field("logs", $.array($.str))

// https://github.com/paritytech/substrate/blob/01a3ad65/primitives/runtime/src/generic/header.rs#L39
/** Abstraction over a block header for a substrate chain. */
export interface Header {
  /** The parent hash. */
  parentHash: string
  /** The block number. */
  number: string
  /** The state trie merkle root */
  stateRoot: string
  /** The merkle root of the extrinsics. */
  extrinsicsRoot: string
  /** A chain-specific digest of data useful for light clients or referencing auxiliary data. */
  digest: Digest
}
export const $header: $.Codec<Header> = $.object(
  $.field("parentHash", $.str),
  $.field("number", $.str),
  $.field("stateRoot", $.str),
  $.field("extrinsicsRoot", $.str),
  $.field("digest", $digest),
)

// https://github.com/paritytech/substrate/blob/ded44948/primitives/runtime/src/generic/block.rs#L88
export interface Block {
  /** The block header. */
  header: Header
  /** The accompanying extrinsics. */
  extrinsics: string[]
}
export const $block: $.Codec<Block> = $.object(
  $.field("header", $header),
  $.field("extrinsics", $.array($.str)),
)

// https://github.com/paritytech/substrate/blob/ded44948/primitives/runtime/src/generic/block.rs#L126
/** Abstraction over a substrate block and justification. */
export interface SignedBlock {
  /** Full block. */
  block: Block
  /** Block justification. */
  justifications: [number[], number[]][] | null
}
export const $signedBlock: $.Codec<SignedBlock> = $.object(
  $.field("block", $block),
  $.field("justifications", $.option($.array($.tuple($.array($.u32), $.array($.u32))), null)),
)

// https://github.com/paritytech/substrate/blob/934fbfd/client/rpc-api/src/chain/mod.rs#L27
export type ChainCalls = {
  /** Get header. */
  chain_getHeader(hash?: string): Header | null
  /** Get header and body of a relay chain block. */
  chain_getBlock(hash?: string): SignedBlock | null
  /**
   * Get hash of the n-th block in the canon chain.
   *
   * By default returns latest block hash.
   */
  chain_getBlockHash(height?: ListOrValue<NumberOrHex>): ListOrValue<string | null>
  chain_getHead: ChainCalls["chain_getBlockHash"]
  /** Get hash of the last finalized block in the canon chain. */
  chain_getFinalizedHead(): string
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
