import { Rune } from "capi"
import { client, Timestamp } from "polkadot/mod.ts"

const block = client.latestBlock
const extrinsics = block.extrinsics()
const events = block.events()
const now = Timestamp.Now.entry([], block.hash)

const root = Rune.rec({
  hash: block.hash,
  block,
  extrinsics,
  events,
  now,
})

let i = 0
for await (const values of root.watch()) {
  console.log(values)
  if (++i === 3) break
}
