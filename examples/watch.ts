import { Rune } from "capi"
import { chain, Timestamp } from "polkadot/mod.js"

const block = chain.latestBlock
const extrinsics = block.extrinsics()
const events = block.events()
const now = Timestamp.Now.value(undefined, block.hash)

const root = Rune.rec({
  hash: block.hash,
  block,
  extrinsics,
  events,
  now,
})

let i = 0
for await (const values of root.iter()) {
  console.log(values)
  if (++i === 3) break
}
