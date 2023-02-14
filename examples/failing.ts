import { alice } from "capi"
import { System as KSystem } from "kusama_dev/mod.ts"
import { System as PSystem } from "polkadot_dev/mod.ts"

console.log(await PSystem.Account.entry([alice.publicKey]).run())
console.log(await KSystem.Account.entry([alice.publicKey]).run())
