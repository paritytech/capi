import * as C from "capi/mod.ts"
import { client } from "polkadot_dev/mod.ts"

const root = client.metadata()

console.log(C.throwIfError(await root.run()))
