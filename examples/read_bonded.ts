import * as C from "capi/mod.ts"

import { Staking } from "polkadot_dev/mod.ts"

const aliceBonded = Staking.Bonded.entry([C.aliceStash.publicKey])

console.log(await aliceBonded.run())
