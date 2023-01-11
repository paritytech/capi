import * as C from "../mod.ts"

import { client } from "polkadot_dev/_/client.ts"

const root = C.metadata(client)()

console.log(C.throwIfError(await root.run()))
