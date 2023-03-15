import { Rune, Sr25519 } from "capi"
import { Balances, System, users } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [alice, bob, charlie] = await users(3)

await Rune
  .chain(balances)
  .chain(() => transfer("bob", bob))
  .chain(balances)
  .chain(() => transfer("charlie", charlie))
  .chain(balances)
  .run()

function balances() {
  return Rune
    .rec({
      alice: balance(alice),
      bob: balance(bob),
      charlie: balance(charlie),
    })
    .dbg("Balances:")
}

function balance(user: Sr25519) {
  return System.Account.value(user.publicKey).unhandle(undefined).access("data", "free")
}

function transfer(name: string, user: Sr25519) {
  return Balances
    .transfer({
      dest: user.address,
      value: 1000123n,
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus(`Transfer to ${name}:`)
    .finalized()
}
