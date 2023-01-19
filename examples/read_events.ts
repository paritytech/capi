import { System } from "polkadot/mod.ts"

const root = System.Events.entry().read()

console.log(await root.run())
