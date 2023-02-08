import { System } from "polkadot_dev/mod.ts"

const result = await System.Account.keyPage(10).run()

console.log(result)
