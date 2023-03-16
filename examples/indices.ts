import { ValueRune } from "capi"
import { Indices, users } from "polkadot_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [alexa] = await users(1)

const index = 254

const claim = Indices
  .claim({ index })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalized()

const result = await claim
  .into(ValueRune)
  .chain(() => Indices.Accounts.value(index).unhandle(undefined).access(0))
  .run()

console.log(`Index ${index} mapped to ${result}}`)
