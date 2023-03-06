import { aliceStash } from "capi"
import { Staking } from "polkadot_dev/mod.ts"

const result = await Staking.Bonded.value(aliceStash.publicKey).run()

console.log(result)
