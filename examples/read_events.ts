import { System } from "polkadot/mod.ts"

const root = System.Events.entry([])

console.log(await root.run())
