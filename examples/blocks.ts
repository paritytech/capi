/**
 * @title Blocks
 * @stability nearing
 *
 * Accessing blocks and block-related data is among the most fundamental of chain
 * client capabilities. In the following example, we'll utilize Capi's fluent API
 * to turning a block reference (in this case the latest block hash) into a block.
 * Then we access various pieces of data pertaining to that block.
 */

import { Rune } from "capi"
import { babeBlockAuthor } from "capi/patterns/consensus/mod.ts"
import { chain } from "polkadot/mod.js"

// Reference the latest block hash.
const blockHash = chain.blockHash()

// Use the latest block hash to reference the associated block.
const block = blockHash.block()

// Use `block` to reference the associated extrinsics...
const extrinsics = block.extrinsics()

// ... and raw extrinsics (hex-scale-encoded strings) ...
const extrinsicsRaw = block.extrinsicsRaw()

// ... and events.
const events = block.events()

// Let's get the author as well.
const author = babeBlockAuthor(chain, blockHash)

// Use `Rune.rec` to parallelize these retrievals.
const result = await Rune
  .rec({
    blockHash,
    block,
    extrinsics,
    extrinsicsRaw,
    events,
    author,
  })
  .run()

console.log(result)
