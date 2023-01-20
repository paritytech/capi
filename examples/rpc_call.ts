import * as C from "capi/mod.ts"

import { client } from "polkadot/mod.ts"

const root = C.rpcCall<[], string[]>("rpc_methods")(client)()

console.log(C.throwIfError(await root.run()))
