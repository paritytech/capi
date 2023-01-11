import * as C from "../mod.ts"

const root = C.rpcCall<[], string[]>("rpc_methods")(C.polkadot)()

console.log(C.throwIfError(await root.run()))
