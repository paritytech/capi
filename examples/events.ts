import { System } from "polkadot/mod.ts"

const result = await System.Events.entry([]).run()

console.log(result)
