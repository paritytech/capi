import { chain } from "polkadot/mod.js"

const result = await chain.latestBlock
  .extrinsics()
  .run()

console.log(result)
