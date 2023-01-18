import * as C from "../mod.ts"

import { client } from "polkadot_dev/client/mod.ts"

const root = C.metadata(client)()

console.log(C.throwIfError(await root.run()))
