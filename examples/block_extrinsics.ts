import { client } from "polkadot/mod.ts"

const result = await client
  .finalizedBlock()
  .extrinsics()
  .run()

console.log(result)
