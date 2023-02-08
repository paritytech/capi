import { Rune, ValueRune } from "capi"
import { client, Timestamp } from "polkadot/mod.ts"

const { blockHash } = client

const block = client.block(blockHash)
const extrinsics = block.extrinsics()
const events = block.events()
const now = Timestamp.Now.entry([], blockHash)

await Rune
  .rec({
    blockHash,
    block,
    extrinsics,
    events,
    now,
  })
  .into(ValueRune)
  .reduce(0, (i, values) => {
    console.log(i, values)
    return i + 1
  })
  .filter((i) => i === 3)
  .run()
