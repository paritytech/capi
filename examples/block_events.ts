import { client } from "polkadot/mod.ts"

const result = await client
  .finalizedBlock()
  .events()
  .run()

console.log(result)
