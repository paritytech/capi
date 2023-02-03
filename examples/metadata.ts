import { client } from "polkadot_dev/mod.ts"

const result = await client.metadata().run()

console.log(result)
