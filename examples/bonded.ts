import * as C from "capi/mod.ts"
import { Staking } from "polkadot_dev/mod.ts"

const result = await Staking.Bonded.entry([C.aliceStash.publicKey]).run()

console.log(result)
