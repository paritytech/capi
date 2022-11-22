import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.metadata(T.polkadot)()

console.log(U.throwIfError(await root.run()))
