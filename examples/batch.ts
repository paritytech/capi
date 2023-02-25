import { alice, bob, charlie, dave, Rune } from "capi"
import { Balances, System, Utility } from "westend_dev/mod.ts"

const recipients = Object.entries({ bob, charlie, dave })

const batch = Utility
  .batch({
    calls: Rune.tuple(recipients.map(([, { address }]) =>
      Balances.transfer({
        dest: address,
        value: 3_000_000_123_456_789n,
      })
    )),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Batch tx:")
  .finalized()

await logBalances()
  .chain(() => batch)
  .chain(logBalances)
  .run()

function logBalances() {
  return Rune.tuple(recipients.map(([name, { publicKey }]) => {
    const free = System.Account.entry([publicKey]).access("data", "free")
    return free.dbg(Rune.str`${name} balance:`)
  }))
}
