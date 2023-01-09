import * as C from "capi/mod.ts"

import { client } from "polkadot_dev/_/client/raw.ts"

const aliceBonded = C.entryRead(client)("Staking", "Bonded", [C.aliceStash.publicKey])

console.log(C.throwIfError(await aliceBonded.run()))
