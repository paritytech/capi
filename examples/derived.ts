import * as C from "../mod.ts"

import { Paras } from "polkadot_dev/mod.ts"

const ids = Paras.Parachains.entry().read().access("value")
const heads = C.Z.each(ids, (id) => Paras.Heads.entry(id).read())

console.log(C.throwIfError(await heads.run()))
