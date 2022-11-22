import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.rpcCall<[], string[]>("rpc_methods")(C.polkadot)()

console.log(U.throwIfError(await root.run()))
