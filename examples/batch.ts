import { Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, System, users, Utility } from "westend_dev/mod.js"

const [alice, bob, charlie, dave] = await users(4)

const recipients = Object.entries({ bob, charlie, dave })

const batch = Utility.batch({
  calls: Rune.tuple(recipients.map(([, { address }]) =>
    Balances.transfer({
      dest: address,
      value: 3_000_000_123_456_789n,
    })
  )),
})
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Batch tx:")
  .finalized()

await logBalances()
  .chain(() => batch)
  .chain(logBalances)
  .run()

function logBalances() {
  return Rune.tuple(recipients.map(([name, { publicKey }]) => {
    const free = System.Account.value(publicKey).unhandle(undefined).access("data", "free")
    return free.dbg(Rune.str`${name} balance:`)
  }))
}
