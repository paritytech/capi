import { Indices, users } from "polkadot_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [alexa] = await users(1)

const index = 254

const finalizedHash = await Indices
  .claim({ index })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalizedHash()
  .run()

const retrieved = await Indices.Accounts
  .value(index, finalizedHash)
  .unhandle(undefined)
  .access(0)
  .run()

console.log(`Index ${index} mapped to ${retrieved}`)
