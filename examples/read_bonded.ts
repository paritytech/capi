import * as C from "../mod.ts"

import { Staking } from "polkadot_dev/mod.ts"

const aliceBonded = Staking.Bonded.entry(C.aliceStash.publicKey).read()

console.log(C.throwIfError(await aliceBonded.run()))
