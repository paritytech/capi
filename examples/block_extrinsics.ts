import { chain } from "polkadot/mod.ts"

const result = await chain.latestBlock.extrinsics().run()

console.log(result)
