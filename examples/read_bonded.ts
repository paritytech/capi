import * as C from "../mod.ts"

import { Bonded } from "polkadot_dev/Staking.ts"

const aliceBonded = Bonded.entry(C.aliceStash.publicKey).read()

console.log(C.throwIfError(await aliceBonded.run()))
