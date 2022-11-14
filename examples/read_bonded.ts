import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

const aliceBonded = C.entryRead(T.polkadot)("Staking", "Bonded", [T.aliceStash.publicKey])

console.log(U.throwIfError(await aliceBonded.run()))
