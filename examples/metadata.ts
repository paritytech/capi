import * as C from "capi/mod.ts"

import { client } from "polkadot_dev/_/client/raw.ts"

const root = C.metadata(client)()

console.log(C.throwIfError(await root.run()))
