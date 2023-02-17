import { ArrayRune, Rune, ValueRune } from "capi"
import { Paras } from "polkadot/mod.ts"

const result = await Paras
  .Parachains
  .entry([])
  .unhandle(undefined)
  .into(ArrayRune)
  .mapArray((id) => Paras.Heads.entry(Rune.tuple([id])))
  .into(ValueRune)
  .rehandle(undefined)
  .run()

console.log(result)
