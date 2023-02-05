import { client } from "polkadot/mod.ts"

const result = await client
  .block()
  .events()
  .run()

console.log(result)
