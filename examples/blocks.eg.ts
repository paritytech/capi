/**
 * @title Blocks
 * @stability nearing
 * @description Utilize Capi's fluent API to turn a block reference (in this
 * case the retrieved latest finalized block hash) into a block. Then access
 * various pieces of data pertaining to that block.
 */

import { $eventRecord, chain, metadata } from "@capi/polkadot"
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

// Use `Rune.object` to parallelize these retrievals.
const collection = await Rune
  .object({
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
    $.field("events", $.array($eventRecord)),
    $.field("author", $.str),
  ),
  collection,
)
