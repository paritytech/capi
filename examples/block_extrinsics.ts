import { client } from "polkadot/mod.ts"

const result = await client
  .block()
  .extrinsics()
  .run()

console.log(result)
