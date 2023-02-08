import { client } from "polkadot/mod.ts"

const result = await client.latestBlock.extrinsics().run()

console.log(result)
