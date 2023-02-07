import { ArrayRune, Rune } from "capi"
import { Paras } from "polkadot/mod.ts"

const result = await Paras
  .Parachains
  .entry([])
  .into(ArrayRune)
  .mapArray((id) => Paras.Heads.entry(Rune.tuple([id])))
  .run()

console.log(result)
