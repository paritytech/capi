import { FinalizedBlockHashRune, Rune } from "capi"
import { client } from "polkadot/mod.ts"

const result = await Rune
  .constant(undefined)
  .into(FinalizedBlockHashRune, client)
  .events()
  .run()

console.log(result)
