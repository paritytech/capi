import { babeBlockAuthor } from "capi/patterns/consensus/mod.ts"
import { client } from "polkadot/mod.ts"

const result = await babeBlockAuthor(client, client.latestBlock.hash).run()

console.log(result)
