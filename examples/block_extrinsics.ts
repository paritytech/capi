import { FinalizedBlockHashRune, Rune } from "capi"
import { client } from "polkadot/mod.ts"

const result = await Rune
  .constant(undefined)
  .into(FinalizedBlockHashRune, client)
  .block()
  .extrinsics()
  .run()

console.log(result)
