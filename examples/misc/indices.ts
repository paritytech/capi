import { AccountIdRune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { chain, createUsers, Indices } from "polkadot_dev/mod.js"

const { alexa } = await createUsers()

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
  .into(AccountIdRune)
  .ss58(chain)
  .run()

console.log(`Index ${index} mapped to ${mapped}}`)
