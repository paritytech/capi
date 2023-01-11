import * as C from "../mod.ts"

import { Heads, Parachains } from "polkadot_dev/Paras.ts"

const ids = Parachains.entry().read().access("value")
const heads = C.Z.each(ids, (id) => Heads.entry(id).read())

console.log(C.throwIfError(await heads.run()))
