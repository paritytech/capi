import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const aliceBonded = C.entryRead(T.polkadot)("Staking", "Bonded", [T.aliceStash.publicKey])

console.log(U.throwIfError(await aliceBonded.run()))
