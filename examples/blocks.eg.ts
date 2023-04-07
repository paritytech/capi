/**
 * @title Blocks
 * @stability nearing
 *
 * Utilize Capi's fluent API to turn a block reference (in this case the
 * retrieved latest finalized block hash) into a block. Then access various
 * pieces of data pertaining to that block.
 */

import { chain, metadata, types } from "@capi/polkadot/mod.js"
import { $, $extrinsic, known, Rune } from "capi"
import { babeBlockAuthor } from "capi/patterns/consensus/mod.ts"

// Reference the latest block hash.
const blockHash = chain.blockHash()

// Reference the associated block.
const block = blockHash.block()

// Reference the associated extrinsics...
const extrinsics = block.extrinsics()

// ... and raw extrinsics (hex-scale-encoded strings) ...
const extrinsicsRaw = block.extrinsicsRaw()

// ... and events.
const events = block.events()

// Reference the author as well.
const author = babeBlockAuthor(chain, blockHash)

// Use `Rune.rec` to parallelize these retrievals.
const collection = await Rune
  .rec({
    blockHash,
    block,
    extrinsics,
    extrinsicsRaw,
    events,
    author,
  })
  .run()

// Ensure that collection contains the expected shape of data.
console.log("Collection:", collection)
$.assert(
  $.object(
    $.field("blockHash", $.str),
    $.field("block", known.$signedBlock),
    $.field("extrinsics", $.array($extrinsic(metadata))),
    $.field("extrinsicsRaw", $.array($.str)),
    $.field("events", $.array(types.frame_system.$eventRecord)),
    $.field("author", $.str),
  ),
  collection,
)
