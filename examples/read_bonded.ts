import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const aliceBonded = C.entryRead(T.polkadot)("Staking", "Bonded", [T.aliceStash.publicKey])

console.log(U.throwIfError(await aliceBonded.run()))
