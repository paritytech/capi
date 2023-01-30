import { ArrayRune, Rune } from "capi/mod.ts"
import { Paras } from "polkadot/mod.ts"

const ids = Paras.Parachains.entry([]).as(ArrayRune)
const result = await ids.mapArray((id) => Paras.Heads.entry(Rune.tuple([id]))).run()

console.log(result)
