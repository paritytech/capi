import { PublicKeyRune } from "capi"
import { chain, Indices, users } from "polkadot_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const { alexa } = await users()

const index = 254

const hash = await Indices
  .claim({ index })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalized()
  .run()

const mapped = await Indices.Accounts
  .value(index, hash)
  .unhandle(undefined)
  .access(0)
  .into(PublicKeyRune)
  .ss58(chain)
  .run()

console.log(`Index ${index} mapped to ${mapped}}`)
