/**
 * @title Watch
 * @stability unstable
 *
 * Capi allows you to model your data requirements and treat them as
 * "watchable" (ie. poll changes upon new block finalizations).
 */

import { Rune } from "capi"
import { chain, Timestamp } from "polkadot/mod.js"

// Describe the sources and shape that you want to watch.
const block = chain.latestBlock
const extrinsics = block.extrinsics()
const events = block.events()
const now = Timestamp.Now.value(undefined, block.hash)
const collection = Rune.rec({
  blockHash: block.hash,
  block,
  extrinsics,
  events,
  now,
})

let i = 0

// Use the `watch` method to retrieve an async iterable, which will
// gather and yield the `collection`-described data upon new blocks.
for await (const values of collection.iter()) {
  console.log(values)
  if (++i === 3) break
}
