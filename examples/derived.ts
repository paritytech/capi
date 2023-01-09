import * as C from "capi/mod.ts"

import { client } from "polkadot_dev/_/client/raw.ts"

const ids = C.entryRead(client)("Paras", "Parachains", [])
  .access("value")
  .as<number[]>()
const root = C.Z.each(ids, (id) => C.entryRead(client)("Paras", "Heads", [id]))

console.log(C.throwIfError(await root.run()))
