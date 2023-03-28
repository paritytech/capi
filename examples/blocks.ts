import { Rune } from "capi"
import { babeBlockAuthor } from "capi/patterns/consensus/mod.ts"
import { chain } from "polkadot/mod.js"

const blockHash = chain.blockHash()
const block = blockHash.block()
const extrinsics = block.extrinsics()
const extrinsicsRaw = block.extrinsicsRaw()
const events = block.events()
const author = babeBlockAuthor(chain, blockHash)

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
