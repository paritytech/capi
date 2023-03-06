import { chain } from "polkadot_dev/mod.ts"

const result = await chain.metadata.run()

console.log(result)
