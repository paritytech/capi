import * as C from "../mod.ts"
import * as U from "../util/mod.ts"

const root = C.rpcCall<[], string[]>("rpc_methods")(C.polkadot.proxy)()

console.log(U.throwIfError(await root.run()))
