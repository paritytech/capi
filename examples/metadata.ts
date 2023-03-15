import { chain } from "polkadot_dev/mod.js"

const result = await chain.metadata.run()

console.log(result)
