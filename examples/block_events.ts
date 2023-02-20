import { chain } from "polkadot/mod.ts"

const result = await chain.latestBlock.events().run()

console.log(result)
