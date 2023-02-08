import { consensus } from "capi/patterns"
import { client } from "polkadot/mod.ts"

const result = await consensus
  .babeBlockAuthor(client, client.latestBlock.hash)
  .run()

console.log(result)
