import { chain } from "polkadot/mod.js"

const result = await chain.latestBlock.events().run()

console.log(result)
