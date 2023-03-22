import { PublicKeyRune } from "capi"
import { chain, Indices, users } from "polkadot_dev/mod.js"
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

const mapped = await Indices.Accounts
  .value(index, finalizedHash)
  .unhandle(undefined)
  .access(0)
  .into(PublicKeyRune)
  .ss58(chain)
  .run()

console.log(`Index ${index} mapped to ${mapped}}`)
