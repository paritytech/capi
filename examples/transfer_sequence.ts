import { Rune, Sr25519 } from "capi"
import { Balances, System, users } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [a, b, c] = await users(3)

await Rune
  .chain(balances)
  .chain(() => transfer("bob", b))
  .chain(balances)
  .chain(() => transfer("charlie", c))
  .chain(balances)
  .run()

function balances() {
  return Rune
    .rec({
      alice: balance(a),
      bob: balance(b),
      charlie: balance(c),
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
    .signed(signature({ sender: a }))
    .sent()
    .dbgStatus(`Transfer to ${name}:`)
    .finalized()
}
