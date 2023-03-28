import { ArrayRune, ValueRune } from "capi"
import { Paras } from "polkadot/mod.js"

const result = await Paras.Parachains
  .value()
  .unhandle(undefined)
  .into(ArrayRune)
  .mapArray((id) => Paras.Heads.value(id))
  .into(ValueRune)
  .rehandle(undefined)
  .run()

console.log(result)
