import { alice, ValueRune } from "capi"
import { chain, Indices } from "polkadot_dev/mod.ts"
import { signature } from "../patterns/signature/polkadot.ts"

const index = 254

const claim = Indices
  .claim({ index })
  .signed(signature(chain, { sender: alice }))
  .sent()
  .dbgStatus()
  .finalized()

const result = await claim
  .into(ValueRune)
  .chain(() => Indices.Accounts.value(index).unhandle(undefined).access(0))
  .run()

console.log(`Index ${index} mapped to ${result}}`)
