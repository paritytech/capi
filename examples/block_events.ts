import { client } from "polkadot/mod.ts"

const result = await client.latestBlock.events().run()

console.log(result)
