import { babeBlockAuthor } from "capi/patterns/consensus/mod.ts"
import { chain } from "polkadot/mod.js"

const result = await babeBlockAuthor(chain, chain.latestBlock.hash).run()

console.log(result)
