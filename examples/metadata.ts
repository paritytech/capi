import { client } from "polkadot_dev/mod.ts"

const root = client.metadata().unwrapError()

console.log(await root.run())
