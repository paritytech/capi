import { ValueRune } from "capi/mod.ts"
import { client } from "polkadot_dev/mod.ts"

const result = await client
  .metadata()
  .as(ValueRune)
  .unwrapError()
  .run()

console.log(result)
