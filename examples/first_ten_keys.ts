import { System } from "polkadot_dev/mod.ts"

const root = System.Account.keyPage(10, [])

console.log(await root.run())
